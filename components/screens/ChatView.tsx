"use client";

import { useEffect, useRef, useState } from "react";
import { CPTS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar, Icon } from "../ui";

export default function ChatView() {
  const { S, A } = useStore();
  const [text, setText] = useState("");
  const msgsRef = useRef<HTMLDivElement>(null);
  const t = S.threads[S.chat!];

  useEffect(() => {
    const e = msgsRef.current;
    if (e) e.scrollTop = e.scrollHeight;
  }, [t.msgs.length, S.chatTips]);

  return (
    <div className="chat">
      <div className="msgs px" ref={msgsRef}>
        <p className="tl">TODAY</p>
        {t.msgs.length ? (
          t.msgs.map((m, i) => {
            const me = !!m.me;
            let a: React.ReactNode = null;
            if (!me) {
              a =
                t.kind === "group" && m.n ? (
                  <Avatar name={m.n} size="xs" i={3 + m.n.length} />
                ) : (
                  <Avatar name={t.name} size="xs" i={t.i} />
                );
            }
            return (
              <div className={`mr ${me ? "me" : ""}`} key={i}>
                {a}
                <div className="bub">
                  {!me && t.kind === "group" && m.n ? <small>{m.n}</small> : null}
                  {m.t}
                </div>
              </div>
            );
          })
        ) : (
          <p className="note" style={{ marginTop: 24 }}>
            You both said yes. Say hi!
          </p>
        )}
      </div>

      {t.kind === "dm" && t.msgs.length < 3 && (
        <div className="px" style={{ background: "var(--surface)" }}>
          <button className="opl" onClick={A.ctips} aria-expanded={S.chatTips}>
            Need pointers on what to say? {S.chatTips ? "Hide" : "Show"}
          </button>
          {S.chatTips && (
            <div className="pt2">
              {CPTS.map((x) => (
                <div key={x}>
                  <Icon n="check" c="sm" />
                  <span>{x}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form
        className="send px"
        onSubmit={(e) => {
          e.preventDefault();
          const v = text.trim();
          if (!v) return;
          A.sendChat(v);
          setText("");
        }}
      >
        <div className="pillin">
          <span className="camc">
            <Icon n="cam" c="sm" />
          </span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            aria-label="Message"
            autoComplete="off"
          />
          <button className="sb">Send</button>
        </div>
      </form>
    </div>
  );
}
