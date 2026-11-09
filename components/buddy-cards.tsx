"use client";

import { useState } from "react";
import { SUBJ } from "@/lib/data";
import type { Card, FlowId, Q, Source } from "@/lib/buddy";
import { pIndex } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar, Icon, SubTag } from "./ui";

type Send = (text: string, flow?: FlowId) => void;

/* ---------- source chips ---------- */
export function Sources({ sources }: { sources: Source[] }) {
  return (
    <div className="srcs" aria-label="Sources">
      {sources.map((s) => (
        <span className="src" key={s.label}>
          <i style={{ background: SUBJ[s.subj].c }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- hint ladder (anti-cheat) ---------- */
function LadderCard({ card, onSend }: { card: Extract<Card, { type: "ladder" }>; onSend: Send }) {
  const [n, setN] = useState(0); // 0 none, 1 hint 1, 2 hint 2, 3 example
  const steps = card.steps;
  return (
    <div className="bcard fade">
      <div className="bch">
        <span className="gbadge">
          <Icon n="shield" c="sm" />
          Guide mode
        </span>
        <span className="bch-t">Hints, not answers</span>
      </div>

      {steps.map((s, i) => (
        <div className="lrow" key={s.label}>
          <span className={`lnum ${n > i ? "on" : ""}`}>{n > i ? <Icon n="check" c="sm" /> : i + 1}</span>
          <div className="lbody">
            <b>{s.label}</b>
            {n > i ? (
              <p className="fade">{s.body}</p>
            ) : n === i ? (
              <button className="lbtn" onClick={() => setN(i + 1)}>
                Show {s.label.toLowerCase()}
              </button>
            ) : (
              <span className="llock">
                <Icon n="lock" c="sm" />
                Unlocks after the one above
              </span>
            )}
          </div>
        </div>
      ))}

      <div className="lrow">
        <span className={`lnum ${n > 2 ? "on" : ""}`}>{n > 2 ? <Icon n="check" c="sm" /> : 3}</span>
        <div className="lbody">
          <b>Similar worked example</b>
          {n > 2 ? (
            <div className="fade">
              <p>{card.example.title}</p>
              <div className="ex">
                {card.example.lines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
              <p className="exn">{card.example.note}</p>
            </div>
          ) : n === 2 ? (
            <button className="lbtn" onClick={() => setN(3)}>
              Show a similar example
            </button>
          ) : (
            <span className="llock">
              <Icon n="lock" c="sm" />
              Unlocks after hint 2
            </span>
          )}
        </div>
      </div>

      <div className="lfoot">
        <span>When you have had a go, I will check your working.</span>
        <button className="btn sm sec" onClick={() => onSend("Check my working", "check")}>
          Check my working
        </button>
      </div>
    </div>
  );
}

/* ---------- quick quiz ---------- */
function QuizCard({ card }: { card: Extract<Card, { type: "quiz" }> }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [fin, setFin] = useState(false);
  const q: Q = card.qs[i];
  const total = card.qs.length;

  const choose = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (k === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= total) setFin(true);
    else {
      setI(i + 1);
      setPick(null);
    }
  };
  const retry = () => {
    setI(0);
    setPick(null);
    setScore(0);
    setFin(false);
  };

  if (fin) {
    return (
      <div className="bcard qz fade">
        <div className="bch">
          <span className="bch-t">{card.title}</span>
        </div>
        <div className="qres">
          <div className="qscore">
            {score}/{total}
          </div>
          <p>
            {score === total
              ? "Clean sweep. You have the key ideas."
              : score >= 2
                ? "Solid. Review the one you missed and you are there."
                : "Worth another look at the slides. Want to try again?"}
          </p>
          <button className="btn sm sec" onClick={retry}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bcard qz fade" key={i}>
      <div className="bch">
        <span className="bch-t">{card.title}</span>
        <span className="qprog">
          Question {i + 1} of {total}
        </span>
      </div>
      <div className="qbody">
        <p className="qq">{q.q}</p>
        <div className="qopts">
          {q.options.map((o, k) => {
            const state = pick === null ? "" : k === q.answer ? "right" : k === pick ? "wrong" : "dim";
            return (
              <button key={o} className={`qopt ${state}`} onClick={() => choose(k)} disabled={pick !== null}>
                <span>{o}</span>
                {state === "right" && <Icon n="check" c="sm" />}
                {state === "wrong" && <Icon n="x" c="sm" />}
              </button>
            );
          })}
        </div>
        {pick !== null && (
          <div className="qexp fade">
            <b>{pick === q.answer ? "Right." : "Not quite."}</b> {q.explain}
            <div style={{ marginTop: 8 }}>
              <Sources sources={[q.source]} />
            </div>
            <button className="btn sm" style={{ marginTop: 10 }} onClick={next}>
              {i + 1 >= total ? "See result" : "Next question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- study with someone ---------- */
function MatchCard({ card }: { card: Extract<Card, { type: "match" }> }) {
  const { S, A } = useStore();
  return (
    <div className="bcard fade">
      <div className="bch">
        <span className="bch-t">Study with someone</span>
      </div>
      <p className="mnote">{card.note}</p>
      {card.people.map((p) => {
        const hasThread = !!S.threads[p.id];
        const asked = S.connected.has(p.id);
        return (
          <div className="mrow" key={p.id}>
            <button className="mwho" onClick={() => A.peek(p.id)} aria-label={`View ${p.name}`}>
              <Avatar name={p.name} size="s" i={pIndex(p)} />
              <span>
                <b>{p.name.split(" ")[0]}, {p.age}</b>
                <span className="mtags">
                  {p.subj.map((k) => (
                    <SubTag key={k} k={k} />
                  ))}
                </span>
              </span>
            </button>
            {hasThread ? (
              <button className="btn sm" onClick={() => A.chat(p.id)}>
                Message
              </button>
            ) : (
              <button className={`btn sm ${asked ? "on" : ""}`} onClick={() => !asked && A.connect(p.id)} disabled={asked}>
                {asked ? "Requested" : "Connect"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- smaller cards ---------- */
function NoSource() {
  return (
    <div className="nosrc fade">
      <Icon n="search" c="sm" />
      No matching source in your course material
    </div>
  );
}

function ScopeCard({ card, onRescope }: { card: Extract<Card, { type: "scope" }>; onRescope: (t: string, f: FlowId) => void }) {
  return (
    <button className="btn sm sec" onClick={() => onRescope(card.retry.text, card.retry.flow)}>
      Search all subjects instead
    </button>
  );
}

export default function BuddyCard({
  card,
  onSend,
  onRescope,
}: {
  card: Card;
  onSend: Send;
  onRescope: (t: string, f: FlowId) => void;
}) {
  switch (card.type) {
    case "ladder":
      return <LadderCard card={card} onSend={onSend} />;
    case "quiz":
      return <QuizCard card={card} />;
    case "match":
      return <MatchCard card={card} />;
    case "scope":
      return <ScopeCard card={card} onRescope={onRescope} />;
    case "nosource":
      return <NoSource />;
  }
}
