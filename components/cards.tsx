"use client";

import { useState } from "react";
import {
  HOOK,
  PEOPLE,
  SHORT,
  SUBJ,
  GRAD,
  pIndex,
  pById,
  type AgendaItem,
  type Meet,
  type Person,
  type Post,
} from "@/lib/data";
import { DAYN, parseK, tf } from "@/lib/dates";
import { useStore } from "@/lib/store";
import { AnonAvatar, Avatar, Icon, SubTag } from "./ui";

/* ---------- meetup row on the home screen ---------- */
export function SessRow({ m, dk }: { m: Meet; dk: string }) {
  const { S, A } = useStore();
  const d = parseK(dk);
  const j = S.joined.has(m.id + "|" + dk);
  return (
    <div className="sess">
      <div className="date">
        <small>{DAYN[d.getDay()].slice(0, 3).toUpperCase()}</small>
        <b>{d.getDate()}</b>
      </div>
      <div className="m">
        <b>{m.subj} Weekly Meetup</b>
        <span>
          {tf(m.s)} to {tf(m.e)}
        </span>
        <span>{m.loc}</span>
        <span style={{ color: "var(--ok)", fontWeight: 900 }}>
          {m.base + (j ? 1 : 0)} students going this week
        </span>
      </div>
      <button className={`btn sm ${j ? "on" : ""}`} onClick={() => A.join(m.id + "|" + dk)}>
        {j ? "Going" : "Join"}
      </button>
    </div>
  );
}

/* ---------- compact person card in the Connect list ---------- */
export function PersonListCard({ p }: { p: Person }) {
  const { A } = useStore();
  const gi = pIndex(p);
  const g = GRAD[gi % GRAD.length];
  return (
    <div className="lc fade" style={{ ["--g0" as string]: g[0] }}>
      <button className="lt2" onClick={() => A.peek(p.id)} aria-label={`View ${p.name}`}>
        <span className="rg">
          <Avatar name={p.name} size="m" i={gi} />
        </span>
        <span className="tx">
          <span className="nm">
            {p.name}, {p.age}
          </span>
          <span className="d1">
            {SHORT[p.id]} · QUT {p.campus}
          </span>
          <span className="tags">
            {p.subj.map((k) => (
              <SubTag key={k} k={k} />
            ))}
            {p.badge && (
              <span className={`pill ${p.id === "priya" ? "mint" : ""}`}>
                {p.id === "priya" ? "Both said yes" : "Top match"}
              </span>
            )}
          </span>
        </span>
      </button>
      <button className="x" onClick={() => A.pass(p.id)} aria-label="Not now">
        <Icon n="x" c="sm" />
      </button>
      <div className="hk">
        <Icon n="spark" c="sm" />
        <span>{HOOK[p.id]}</span>
      </div>
      <div className="la">
        <button className="btn sm" onClick={() => A.connect(p.id)}>
          Connect
        </button>
        <button className="btn sm ghost" onClick={() => A.peek(p.id)}>
          View profile
        </button>
      </div>
    </div>
  );
}

/* ---------- full profile card shown in the bottom sheet ---------- */
export function PersonSheetCard({ p }: { p: Person }) {
  const { A } = useStore();
  const gi = pIndex(p);
  const g = GRAD[gi % GRAD.length];
  return (
    <div className="card dcard fade">
      <div className="cv" style={{ background: `linear-gradient(125deg,${g[0]},${g[1]})` }}>
        {p.badge && (
          <span className={`pill badge ${p.id === "priya" ? "mint" : ""}`}>
            <Icon n={p.id === "priya" ? "check" : "spark"} c="sm" />
            {p.badge}
          </span>
        )}
      </div>
      <div className="who">
        <Avatar name={p.name} size="l" i={gi} />
        <h3>
          {p.name}, {p.age}
        </h3>
        <p>{p.deg}</p>
        <span className="campus">
          <Icon n="pinloc" c="sm" />
          QUT {p.campus}
        </span>
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {p.subj.map((k) => (
            <SubTag key={k} k={k} />
          ))}
        </div>
      </div>
      <div className="dbody">
        <div className="chips" style={{ justifyContent: "center" }}>
          {p.tags.map((t) => (
            <span key={t} className="chip static">
              {t}
            </span>
          ))}
        </div>
        <div className="why">
          <h4>
            <Icon n="spark" c="sm" />
            Why you might work well together
          </h4>
          <ul>
            {p.why.slice(0, 2).map((w) => (
              <li key={w}>
                <Icon n="check" c="sm" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="acts">
          <button className="btn ghost" onClick={() => A.pass(p.id)}>
            Not now
          </button>
          <button className="btn" onClick={() => A.connect(p.id)}>
            <Icon n="plus" c="sm" />
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- one row in the day agenda ---------- */
export function AgendaRow({ it, dk }: { it: AgendaItem; dk: string }) {
  const { S, A } = useStore();
  const tm = (
    <div className="tm">
      <b>{tf(it.s)}</b>
      <span>{tf(it.e)}</span>
    </div>
  );

  if (it.kind === "class") {
    return (
      <div className="ag">
        {tm}
        <div className="ev" style={{ ["--c" as string]: SUBJ[it.subj].c }}>
          <span className="kind">Your timetable · {it.type}</span>
          <h4>
            {it.subj} {SUBJ[it.subj].n}
          </h4>
          <span className="loc">
            <Icon n="pinloc" c="sm" />
            {it.loc}
          </span>
        </div>
      </div>
    );
  }

  if (it.kind === "meetup") {
    const j = S.joined.has(it.id + "|" + dk);
    const w = PEOPLE.filter((p) => p.subj.includes(it.subj)).slice(0, 3);
    return (
      <div className="ag">
        {tm}
        <div className="ev meetup" style={{ ["--c" as string]: SUBJ[it.subj].c }}>
          <span className="kind">Weekly meetup · every {DAYN[parseK(dk).getDay()]}</span>
          <h4>{it.subj} Weekly Meetup</h4>
          <span className="loc">
            <Icon n="pinloc" c="sm" />
            {it.loc}
          </span>
          <div className="going">
            <div className="stack">
              {w.map((p) => (
                <Avatar key={p.id} name={p.name} size="xs" i={pIndex(p)} />
              ))}
            </div>
            {it.base + (j ? 1 : 0)} students going this week
          </div>
          <div className="r2">
            {it.fits ? (
              <span className="fits">
                <Icon n="check" c="sm" />
                Fits your timetable
              </span>
            ) : (
              <span />
            )}
            <button className={`btn sm ${j ? "on" : ""}`} onClick={() => A.join(it.id + "|" + dk)}>
              {j ? "Going" : "Join"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const r = S.rsvp.has(it.id);
  return (
    <div className="ag">
      {tm}
      <div className="ev club" style={{ ["--c" as string]: "#E8750A" }}>
        <span className="kind">Club event · {it.club}</span>
        <h4>{it.t}</h4>
        <span className="loc">
          <Icon n="pinloc" c="sm" />
          {it.loc}
        </span>
        <div className="going">
          <div className="stack">
            {it.who.map((id) => {
              const p = pById(id);
              return <Avatar key={id} name={p.name} size="xs" i={pIndex(p)} />;
            })}
          </div>
          {it.going + (r ? 1 : 0)} students from your subjects going
        </div>
        <div className="r2">
          <span className="fits" style={{ color: "var(--muted)" }}>
            A relaxed way to meet people
          </span>
          <button className={`btn sm ${r ? "on" : ""}`} onClick={() => A.rsvp(it.id)}>
            {r ? "Going" : "I’m going"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- anonymous board post ---------- */
export function PostCard({ p }: { p: Post }) {
  const { S, A } = useStore();
  const [text, setText] = useState("");
  const h = S.helpful.has(p.id);
  const o = S.open.has(p.id);
  return (
    <article className="card post fade">
      <div className="hd">
        <AnonAvatar />
        <div>
          <b>Anonymous</b>
          <small>
            <SubTag k={p.subj} /> · {p.time}
          </small>
        </div>
      </div>
      <p className="q">{p.q}</p>
      {p.tutor && (
        <div className="tutor">
          <b>Tutor reply</b>
          {p.tutor}
        </div>
      )}
      {o && (
        <div className="cmts">
          {p.cm.length ? (
            p.cm.map((c, i) => (
              <div className="cmt" key={i}>
                <b>Anonymous</b>
                <br />
                {c.t}
              </div>
            ))
          ) : (
            <div className="cmt" style={{ color: "var(--muted)" }}>
              No replies yet. Be the first.
            </div>
          )}
          <form
            className="send"
            style={{ padding: 0, border: 0, background: "none" }}
            onSubmit={(e) => {
              e.preventDefault();
              const t = text.trim();
              if (!t) return;
              A.reply(p.id, t);
              setText("");
            }}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Reply anonymously"
              aria-label="Reply"
              autoComplete="off"
            />
            <button className="btn" aria-label="Send reply">
              <Icon n="send" c="sm" />
            </button>
          </form>
        </div>
      )}
      <div className="ft">
        <button className="act" aria-pressed={h} onClick={() => A.helpful(p.id)}>
          <Icon n="help" c="sm" />
          Helpful{h ? " · " + (p.helpful + 1) : ""}
        </button>
        <button className="act" aria-pressed={o} onClick={() => A.open(p.id)}>
          <Icon n="reply" c="sm" />
          {p.cm.length} {p.cm.length === 1 ? "reply" : "replies"}
        </button>
      </div>
    </article>
  );
}
