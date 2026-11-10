"use client";

import { useState } from "react";
import { SUBJ_KEYS } from "@/lib/data";
import { score } from "@/lib/search";
import { useStore } from "@/lib/store";
import { PostCard } from "../cards";
import { Avatar, Icon } from "../ui";

function Feed() {
  const { S } = useStore();
  let list = S.posts.filter((p) => S.filter === "All" || p.subj === S.filter);
  let head: React.ReactNode = null;
  const q = S.q.trim();
  if (q) {
    list = list
      .map((p) => [score(q, p), p] as const)
      .filter((x) => x[0] >= 0.3)
      .sort((a, b) => b[0] - a[0])
      .map((x) => x[1]);
    head = (
      <p className="res">
        {list.length
          ? list.length + " similar question" + (list.length > 1 ? "s" : "") + " already asked"
          : "No one has asked this yet. You can post it above."}
      </p>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {head}
      {list.length
        ? list.map((p) => <PostCard key={p.id} p={p} />)
        : !q && (
            <div className="card empty">
              <b>No questions yet</b>
              <span>Be the first to ask in {S.filter}.</span>
            </div>
          )}
    </div>
  );
}

function Board() {
  const { S, A } = useStore();
  const [text, setText] = useState("");
  const ok = S.filter !== "All";

  const similar =
    text.trim().length > 8
      ? S.posts
          .map((p) => [score(text, p), p] as const)
          .filter((x) => x[0] >= 0.5)
          .sort((a, b) => b[0] - a[0])
          .slice(0, 2)
          .map((x) => x[1])
      : [];

  return (
    <>
      <div className="chiprow">
        {["All", ...SUBJ_KEYS].map((k) => (
          <button key={k} className="chip" aria-pressed={S.filter === k} onClick={() => A.filter(k)}>
            {k}
          </button>
        ))}
      </div>
      <label className="search" style={{ height: 46 }}>
        <Icon n="search" />
        <input
          type="text"
          value={S.q}
          onChange={(e) => A.setQ(e.target.value)}
          placeholder="Search to see if it has been asked"
          aria-label="Search questions"
        />
      </label>
      <div className="card compose">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask your cohort a question"
          aria-label="Your question"
        />
        <div className="sim">
          {similar.length > 0 && (
            <>
              <span className="hd2">
                <Icon n="search" c="sm" />
                Already asked? These might help
              </span>
              {similar.map((p) => (
                <div className="simi" key={p.id}>
                  <b>{p.q}</b>
                  <span>{p.tutor || (p.cm[0] && p.cm[0].t) || "Be the first to reply."}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="cf">
          <span className="where">
            <Icon n="lock" c="sm" />
            {ok ? (
              <>
                Posting in <b>{S.filter}</b>
              </>
            ) : (
              "Choose a subject above to post"
            )}
          </span>
          <button
            className="btn sm"
            disabled={!text.trim() || !ok}
            onClick={() => {
              if (A.post(text)) setText("");
            }}
          >
            Post
          </button>
        </div>
      </div>
      <Feed />
    </>
  );
}

function ThreadRows() {
  const { S, A } = useStore();
  const q = S.ms.trim().toLowerCase();
  const kind = S.ctab === "messages" ? "dm" : "group";
  const ks = Object.keys(S.threads).filter(
    (k) => S.threads[k].kind === kind && S.threads[k].name.toLowerCase().includes(q),
  );

  return (
    <div>
      {S.ctab === "groups" && !q && (
        <button className="dmrow" onClick={A.newgroup}>
          <span className="avw">
            <div className="av m anon">
              <Icon n="plus" />
            </div>
          </span>
          <span className="m">
            <b>Start a study group</b>
            <span>Invite people from your subjects</span>
          </span>
        </button>
      )}
      {ks.map((k) => {
        const t = S.threads[k];
        let avatar: React.ReactNode;
        if (t.kind === "group") {
          const names = Array.from(new Set(t.msgs.filter((m) => m.n).map((m) => m.n as string)))
            .concat(["Me", "You"])
            .slice(0, 2);
          avatar = (
            <div className="gav">
              <Avatar name={names[0]} size="s" i={t.i} />
              <Avatar name={names[1]} size="s" i={t.i + 2} />
            </div>
          );
        } else {
          avatar = (
            <span className="avw">
              <Avatar name={t.name} size="m" i={t.i} />
              {t.active && <i className="on" />}
            </span>
          );
        }
        return (
          <button className="dmrow" key={k} onClick={() => A.chat(k)}>
            {avatar}
            <span className="m">
              <b className={t.unread ? "u" : ""}>{t.name}</b>
              <span className={t.unread ? "u" : ""}>
                {t.last} · {t.time}
              </span>
            </span>
            {t.unread ? (
              <i className="unread" />
            ) : (
              <span className="cam">
                <Icon n="cam" />
              </span>
            )}
          </button>
        );
      })}
      {ks.length === 0 && (
        <p className="note" style={{ padding: "20px 0" }}>
          No chats found.
        </p>
      )}
    </div>
  );
}

export default function Collaborate() {
  const { S, A } = useStore();
  const tabs: [State_ctab, string][] = [
    ["board", "Board"],
    ["messages", "Messages"],
    ["groups", "Groups"],
  ];

  return (
    <>
      <div className="seg" role="tablist">
        {tabs.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={S.ctab === k} onClick={() => A.ctab(k)}>
            {l}
          </button>
        ))}
      </div>
      <div className="pad px fade" style={{ paddingTop: 14 }}>
        {S.ctab === "board" ? (
          <Board />
        ) : (
          <div className="dm">
            <div className="dmh">
              <b>{S.ctab === "messages" ? "Messages" : "Study groups"}</b>
              <button className="link" onClick={A.reqs}>
                {S.ctab === "messages" ? "Requests" : "Invites"}
              </button>
            </div>
            <label className="search" style={{ height: 42 }}>
              <Icon n="search" c="sm" />
              <input
                type="text"
                value={S.ms}
                onChange={(e) => A.setMs(e.target.value)}
                placeholder="Search"
                aria-label="Search chats"
              />
            </label>
            <ThreadRows />
          </div>
        )}
      </div>
    </>
  );
}

type State_ctab = "board" | "messages" | "groups";
