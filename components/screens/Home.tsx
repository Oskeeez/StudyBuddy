"use client";

import { useState } from "react";
import { MEET, POSTS, SUBJ, TODO, pIndex } from "@/lib/data";
import { pool, useStore } from "@/lib/store";
import { SessRow } from "../cards";
import TipCard from "../TipCard";
import { Avatar, Icon, Mascot } from "../ui";

export default function Home() {
  const { S, A } = useStore();
  const [hs, setHs] = useState("");
  const pl = pool(S);
  const top = pl[0];
  const stk = pl.slice(0, 3);
  const pin = POSTS[0];

  return (
    <div className="pad px fade">
      <section className="hero">
        <div className="hrow">
          <span className="pill qutp">QUT · Semester 2</span>
          <button className="ibtn" onClick={A.bell} aria-label="Notifications">
            <Icon n="bell" />
            <i className="dot" />
          </button>
        </div>
        <div className="hi">
          <h2>
            Hey <u>Anusha!</u>
          </h2>
          <Mascot />
        </div>
      </section>

      <form
        className="search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          A.homeSearch(hs);
        }}
      >
        <Icon n="search" />
        <input
          type="text"
          value={hs}
          onChange={(e) => setHs(e.target.value)}
          placeholder="Search for a subject, group or question..."
          aria-label="Search"
        />
      </form>

      <TipCard />

      <button className="fc blue" onClick={() => A.go("discover")}>
        <div className="hd">
          <div className="ic">
            <Icon n="discover" c="lg" />
          </div>
          <div className="t">
            <h3>Find Your People</h3>
            <p>Meet QUT students who study like you, and join weekly meetups.</p>
          </div>
          <span className="go">
            <Icon n="arrow" c="sm" />
          </span>
        </div>
        {top && (
          <div className="topm">
            <div className="stack">
              {stk.map((p) => (
                <Avatar key={p.id} name={p.name} size="m" i={pIndex(p)} />
              ))}
            </div>
            <div className="info">
              <span className="pill">
                <Icon n="spark" c="sm" />
                Top match
              </span>
              <b>
                {top.name.split(" ")[0]}, {top.age}
              </b>
              <span className="d">{top.deg}</span>
              <span className="d" style={{ marginTop: 3 }}>
                {top.subj.join(" · ")}
              </span>
            </div>
          </div>
        )}
      </button>

      <div className="fc peri" role="group">
        <button
          className="hd"
          style={{ textAlign: "left", width: "100%" }}
          onClick={() => A.go("collaborate")}
        >
          <div className="ic">
            <Icon n="collab" c="lg" />
          </div>
          <div className="t">
            <h3>Collaborate</h3>
            <p>Ask questions and chat with your cohort.</p>
          </div>
          <span className="go">
            <Icon n="arrow" c="sm" />
          </span>
        </button>
        <div className="tiles">
          <button className="tile" onClick={() => A.go("collaborate")}>
            <span className="k">
              <Icon n="pin" c="sm" />
              Pinned question
            </span>
            <b>{pin.q.length > 58 ? pin.q.slice(0, 56) + "..." : pin.q}</b>
            <small>
              <Icon n="reply" c="sm" />
              {pin.cm.length + 1} replies
            </small>
          </button>
          <button className="tile" onClick={A.openGroups}>
            <span className="k">
              <Icon n="group" c="sm" />
              Your groups
            </span>
            <b>EGB275 Study Group</b>
            <small>
              <i
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--ok)",
                  display: "inline-block",
                }}
              />
              New messages
            </small>
          </button>
        </div>
      </div>

      <button
        className="fc mint"
        style={{ position: "relative", overflow: "hidden" }}
        onClick={() => A.go("buddy")}
      >
        <div className="hd" style={{ paddingRight: 90 }}>
          <div className="ic">
            <Icon n="spark" c="lg" />
          </div>
          <div className="t">
            <h3>Your Personal Study Buddy</h3>
            <p>Ask anything and get explanations built around your course.</p>
          </div>
        </div>
        <Mascot c="mas" />
        <span className="go" style={{ position: "absolute", right: 12, top: 14 }}>
          <Icon n="arrow" c="sm" />
        </span>
      </button>

      <section>
        <div className="sec-h">
          <h2>To do</h2>
          <span className="link" style={{ color: "var(--muted)" }}>
            {TODO.length - S.done.size} left
          </span>
        </div>
        <div className="card todo">
          {TODO.map((x) => {
            const d = S.done.has(x.id);
            return (
              <div key={x.id} className={`td ${d ? "done" : ""}`}>
                <button className="r" onClick={() => A.todo(x.id)} aria-label="Mark done">
                  <span className="chk">
                    <Icon n="check" c="sm" />
                  </span>
                  <span>
                    <span className="t">{x.t}</span>
                    <br />
                    <span className="s">
                      <span className="tag" style={{ background: SUBJ[x.subj].c }}>
                        {x.subj}
                      </span>{" "}
                      {x.s}
                    </span>
                  </span>
                </button>
                {d ? (
                  <p className="ok">Nice work. That one is done.</p>
                ) : (
                  <div className="nudge">
                    <b>
                      Suggested next step
                    </b>
                    {x.nudge}
                    <button onClick={() => A.nudge(x.id)}>{x.act} →</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="sec-h">
          <h2>This week’s meetups</h2>
          <button className="link" onClick={A.openSessions}>
            See all →
          </button>
        </div>
        <div className="card">
          <SessRow m={MEET[3]} dk="2026-11-10" />
          <SessRow m={MEET[0]} dk="2026-11-13" />
        </div>
      </section>

    </div>
  );
}
