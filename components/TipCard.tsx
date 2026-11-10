"use client";

import { useState } from "react";
import { PTS, SAYP, TIPS, pById, pIndex } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar, Icon } from "./ui";

export default function TipCard() {
  const { S, A } = useStore();
  const [msg, setMsg] = useState("");
  const t = TIPS[S.tip];

  return (
    <div className="buddy fade" key={S.tip}>
      <div className="h">
        <b>
          <small>Buddy</small>
          {t.h}
        </b>
        <span className="pg">
          {TIPS.map((_, i) => (
            <i key={i} className={i === S.tip ? "on" : ""} />
          ))}
        </span>
      </div>
      <p>{t.text}</p>
      {t.who.length > 0 && (
        <div className="stack">
          {t.who.map((id) => {
            const p = pById(id);
            return <Avatar key={id} name={p.name} size="m" i={pIndex(p)} />;
          })}
        </div>
      )}
      {S.tipOpen === "tips" && t.k === "tips" && (
        <div className="pt">
          {PTS.map((x) => (
            <div key={x}>
              <Icon n="check" c="sm" />
              <span>{x}</span>
            </div>
          ))}
        </div>
      )}
      {S.tipOpen === "say" && t.k === "say" && (
        <>
          <div className="pt">
            {SAYP.map((x) => (
              <div key={x}>
                <Icon n="check" c="sm" />
                <span>{x}</span>
              </div>
            ))}
          </div>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write your own message to all 3"
            aria-label="Your message"
          />
          <button
            className="btn"
            disabled={!msg.trim()}
            onClick={() => {
              A.saySend(msg.trim());
              setMsg("");
            }}
          >
            <Icon n="send" c="sm" />
            Send
          </button>
        </>
      )}
      <div className="row">
        <button className="btn sm" onClick={A.tipGo}>
          {t.cta}
        </button>
        <button className="lk" onClick={A.tipNext}>
          Next idea →
        </button>
      </div>
    </div>
  );
}
