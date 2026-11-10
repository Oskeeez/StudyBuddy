"use client";

import { useState } from "react";
import { SUBJ } from "@/lib/data";
import type { Card, FlowId, Q, Source } from "@/lib/buddy";
import { pIndex } from "@/lib/data";
import { LECTURE } from "@/lib/lectures";
import { useStore } from "@/lib/store";
import { Avatar, Icon, SubTag } from "./ui";

type Send = (text: string, flow?: FlowId) => void;

/* ---------- source chips: tap one to see the lecture content it came from ---------- */
export function Sources({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const cur = sources.find((x) => x.label === open);
  const ex = cur ? LECTURE[cur.label] : null;
  return (
    <div className="srcw">
      <div className="srcs" aria-label="Sources">
        {sources.map((x) => {
          const dot = <i style={{ background: SUBJ[x.subj].c }} />;
          if (!LECTURE[x.label])
            return (
              <span className="src" key={x.label}>
                {dot}
                {x.label}
              </span>
            );
          const on = open === x.label;
          return (
            <button
              className={`src tap ${on ? "on" : ""}`}
              key={x.label}
              aria-expanded={on}
              onClick={() => setOpen(on ? null : x.label)}
            >
              {dot}
              {x.label}
              <Icon n="arrow" c="sm" />
            </button>
          );
        })}
      </div>
      {cur && ex && (
        <div className="lex fade" style={{ borderLeftColor: SUBJ[cur.subj].c }}>
          <div className="lex-h">
            <Icon n="book" c="sm" />
            <span>
              From your {ex.kind} · {ex.where}
            </span>
          </div>
          <b>{ex.heading}</b>
          <ul>
            {ex.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- guided practice: steps to try, a nudge if stuck ---------- */
function LadderCard({ card, onSend }: { card: Extract<Card, { type: "ladder" }>; onSend: Send }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [nudged, setNudged] = useState<Set<number>>(new Set());
  const [ex, setEx] = useState(false);
  const flip = (set: Set<number>, k: number) => {
    const x = new Set(set);
    if (x.has(k)) x.delete(k);
    else x.add(k);
    return x;
  };
  const n = card.steps.length;
  const cur = card.steps.findIndex((_, k) => !done.has(k));
  return (
    <div className="bcard fade">
      <div className="bch">
        <span className="bch-t">Let's work through it</span>
        <span className="qprog">
          {done.size} of {n} steps
        </span>
      </div>
      <div className="qbar" aria-hidden="true">
        <i style={{ width: `${(done.size / n) * 100}%` }} />
      </div>

      {card.steps.map((s, k) => (
        <div className={`lrow ${k === cur ? "now" : ""}`} key={s.label}>
          <button
            className={`lnum ${done.has(k) ? "on" : ""}`}
            onClick={() => setDone((d) => flip(d, k))}
            role="checkbox"
            aria-checked={done.has(k)}
            aria-label={`Step ${k + 1} done`}
          >
            {done.has(k) ? <Icon n="check" c="sm" /> : k + 1}
          </button>
          <div className="lbody">
            <b>{s.label}</b>
            <p>{s.task}</p>
            {nudged.has(k) ? (
              <p className="ltip fade">
                <Icon n="bulb" c="sm" />
                <span>{s.nudge}</span>
              </p>
            ) : (
              !done.has(k) && (
                <button className="lbtn" onClick={() => setNudged((x) => flip(x, k))}>
                  Need a nudge?
                </button>
              )
            )}
          </div>
        </div>
      ))}

      <div className="lrow">
        <span className="lnum ex">
          <Icon n="book" c="sm" />
        </span>
        <div className="lbody">
          <b>Want to see a similar one first?</b>
          {ex ? (
            <div className="fade">
              <p>{card.example.title}</p>
              <div className="ex">
                {card.example.lines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
              <p className="exn">{card.example.note}</p>
            </div>
          ) : (
            <button className="lbtn" onClick={() => setEx(true)}>
              Show me a worked example
            </button>
          )}
        </div>
      </div>

      <div className="lfoot">
        <span>{done.size === n ? "Nice work. Want me to look over what you did?" : "When you have had a go, I can look over your working."}</span>
        <button className="btn sm sec" onClick={() => onSend("Check my working", "check")}>
          Check my working
        </button>
      </div>
    </div>
  );
}

/* ---------- quick quiz ---------- */
function QuizCard({ card, onSend }: { card: Extract<Card, { type: "quiz" }>; onSend: Send }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [picks, setPicks] = useState<number[]>([]);
  const [fin, setFin] = useState(false);
  const q: Q = card.qs[i];
  const total = card.qs.length;
  const score = picks.filter((p, k) => p === card.qs[k].answer).length;

  const choose = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    setPicks((p) => [...p, k]);
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
    setPicks([]);
    setFin(false);
  };

  if (fin) {
    const missed = card.qs.filter((x, k) => picks[k] !== x.answer);
    const revise = missed.filter((x, k, arr) => arr.findIndex((y) => y.revise === x.revise) === k);
    return (
      <div className="bcard qz fade">
        <div className="bch">
          <span className="bch-t">{card.title}</span>
          <span className="qprog">Result</span>
        </div>
        <div className="qres">
          <div className="qscore">
            {score}/{total}
          </div>
          <p>
            {score === total
              ? "Clean sweep. You have the key ideas."
              : score >= 2
                ? "Solid. Look at the one you missed and you are there."
                : "Worth another pass over the slides."}
          </p>
        </div>
        <div className="qrev">
          {card.qs.map((x, k) => {
            const ok = picks[k] === x.answer;
            return (
              <div className="qrow" key={x.topic}>
                <span className={`qmark ${ok ? "right" : "miss"}`}>
                  <Icon n={ok ? "check" : "x"} c="sm" />
                </span>
                <span className="qtopic">{x.topic[0].toUpperCase() + x.topic.slice(1)}</span>
                {!ok && (
                  <button className="lbtn" onClick={() => onSend(`Recap: ${x.topic}`, x.revise)}>
                    Recap
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="lfoot">
          <span>{revise.length ? "Tap Recap on any you missed." : "Want another round?"}</span>
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
          {i + 1} of {total}
        </span>
      </div>
      <div className="qbar" aria-hidden="true">
        <i style={{ width: `${((i + (pick !== null ? 1 : 0)) / total) * 100}%` }} />
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

/* ---------- checklist (structure for an assignment, not the writing) ---------- */
function ChecklistCard({ card, onSend }: { card: Extract<Card, { type: "checklist" }>; onSend: Send }) {
  const [on, setOn] = useState<Set<number>>(new Set());
  const n = on.size;
  const all = n === card.items.length;
  const toggle = (k: number) =>
    setOn((s) => {
      const x = new Set(s);
      if (x.has(k)) x.delete(k);
      else x.add(k);
      return x;
    });
  return (
    <div className="bcard fade">
      <div className="bch">
        <span className="bch-t">{card.title}</span>
        <span className="qprog">
          {n} of {card.items.length} covered
        </span>
      </div>
      <div className="qbar" aria-hidden="true">
        <i style={{ width: `${(n / card.items.length) * 100}%` }} />
      </div>
      {card.items.map((t, k) => (
        <button className={`crow ${on.has(k) ? "on" : ""}`} key={t} onClick={() => toggle(k)} aria-pressed={on.has(k)}>
          <span className="cbox">{on.has(k) && <Icon n="check" c="sm" />}</span>
          <span>{t}</span>
        </button>
      ))}
      {all && (
        <div className="lfoot fade">
          <span>{card.finish}</span>
          <button className="btn sm sec" onClick={() => onSend("Check my outline", "check")}>
            Check my outline
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- formulas ---------- */
function FormulasCard({ card }: { card: Extract<Card, { type: "formulas" }> }) {
  return (
    <div className="bcard fade">
      <div className="bch">
        <span className="bch-t">{card.title}</span>
      </div>
      {card.rows.map((r) => (
        <div className="frow" key={r.label}>
          <span>{r.label}</span>
          <code>{r.formula}</code>
        </div>
      ))}
      <p className="fnote">{card.note}</p>
    </div>
  );
}

/* ---------- what is due: ticks are live, so the Home to-do list stays in step ---------- */
function DueCard({ card, onSend }: { card: Extract<Card, { type: "due" }>; onSend: Send }) {
  const { S, A } = useStore();
  const left = card.items.filter((t) => !S.done.has(t.id)).length;
  return (
    <div className="bcard fade">
      <div className="bch">
        <span className="bch-t">Due soon</span>
        <span className="qprog">{left ? `${left} to go` : "All done"}</span>
      </div>
      {card.items.map((t) => {
        const done = S.done.has(t.id);
        return (
          <div className={`drow ${done ? "done" : ""}`} key={t.id}>
            <button className="cbox" role="checkbox" aria-checked={done} aria-label={`Mark ${t.t} done`} onClick={() => A.todo(t.id)}>
              {done && <Icon n="check" c="sm" />}
            </button>
            <div className="dmain">
              <b>{t.t}</b>
              <span>
                <SubTag k={t.subj} /> <span className="dd">{t.s}</span>
              </span>
            </div>
            {!done && (
              <button className="btn sm sec" onClick={() => onSend(t.prompt, t.flow)}>
                Help me start
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- study with someone ---------- */
function MatchCard({ card }: { card: Extract<Card, { type: "match" }> }) {
  const { S, A } = useStore();
  const [openWhy, setOpenWhy] = useState<string | null>(null);
  return (
    <div className="bcard fade">
      <div className="bch">
        <span className="bch-t">Study with someone</span>
      </div>
      <p className="mnote">{card.note}</p>
      {card.people.map((p) => {
        const hasThread = !!S.threads[p.id];
        const asked = S.connected.has(p.id);
        const more = openWhy === p.id;
        return (
          <div className="mrow" key={p.id}>
            <div className="mtop">
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
            <div className="bwhy">
              <Icon n="spark" c="sm" />
              <div>
                <span className="bwhy-l">Why you two fit</span>
                {more ? (
                  <ul className="fade">
                    {p.why.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{p.why[1] ?? p.why[0]}</p>
                )}
                <button className="lbtn" onClick={() => setOpenWhy(more ? null : p.id)} aria-expanded={more}>
                  {more ? "Show less" : "See all reasons"}
                </button>
              </div>
            </div>
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
      return <QuizCard card={card} onSend={onSend} />;
    case "checklist":
      return <ChecklistCard card={card} onSend={onSend} />;
    case "formulas":
      return <FormulasCard card={card} />;
    case "due":
      return <DueCard card={card} onSend={onSend} />;
    case "match":
      return <MatchCard card={card} />;
    case "scope":
      return <ScopeCard card={card} onRescope={onRescope} />;
    case "nosource":
      return <NoSource />;
  }
}
