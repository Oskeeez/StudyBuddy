"use client";

import { SUBJ_KEYS, itemsFor } from "@/lib/data";
import { DAYN, MON, TODAY, addDays, dkey, parseK } from "@/lib/dates";
import { pool, useStore } from "@/lib/store";
import { AgendaRow, PersonListCard } from "../cards";
import TipCard from "../TipCard";
import { Icon } from "../ui";

export default function Discover() {
  const { S, A } = useStore();

  let body: React.ReactNode;
  if (S.dtab === "people") {
    const list = pool(S).filter((p) => S.filter === "All" || p.subj.includes(S.filter as never));
    body = (
      <>
        <div className="chiprow">
          {["All", ...SUBJ_KEYS].map((k) => (
            <button key={k} className="chip" aria-pressed={S.filter === k} onClick={() => A.filter(k)}>
              {k}
            </button>
          ))}
        </div>
        {list.length ? (
          <>
            <div className="plist">
              {list.map((p) => (
                <PersonListCard key={p.id} p={p} />
              ))}
            </div>
            <p className="count">That is everyone for now. New people join every week.</p>
          </>
        ) : (
          <div className="card empty">
            <b>You are all caught up</b>
            <span>No more matches{S.filter === "All" ? "" : " in " + S.filter} right now.</span>
            <button className="btn sec" onClick={A.resetP}>
              Show everyone again
            </button>
          </div>
        )}
      </>
    );
  } else {
    const sel = parseK(S.day);
    const days = [...Array(7)].map((_, i) => addDays(S.wk, i));
    const a = days[0];
    const z = days[6];
    const lab =
      a.getMonth() === z.getMonth()
        ? MON[a.getMonth()] + " " + a.getFullYear()
        : MON[a.getMonth()].slice(0, 3) + " / " + MON[z.getMonth()].slice(0, 3) + " " + z.getFullYear();
    const its = itemsFor(sel);
    const n = its.filter((i) => i.kind !== "class").length;
    body = (
      <>
        <TipCard />
        <div className="card cal">
          <div className="calh">
            <button className="ibtn" onClick={() => A.wk(-1)} aria-label="Previous week">
              <Icon n="back" />
            </button>
            <h3>{lab}</h3>
            <button
              className="ibtn"
              onClick={() => A.wk(1)}
              aria-label="Next week"
              style={{ transform: "scaleX(-1)" }}
            >
              <Icon n="back" />
            </button>
          </div>
          <div className="week">
            {days.map((d) => {
              const k = dkey(d);
              const it = itemsFor(d);
              return (
                <button
                  key={k}
                  className={`wd ${k === dkey(TODAY) ? "today" : ""}`}
                  aria-pressed={k === S.day}
                  onClick={() => A.day(k)}
                  aria-label={`${DAYN[d.getDay()]} ${d.getDate()}`}
                >
                  <small>{DAYN[d.getDay()].slice(0, 1)}</small>
                  <span className="n">{d.getDate()}</span>
                  <span className="dots">
                    {it.some((i) => i.kind === "meetup") && <i style={{ background: "var(--blue)" }} />}
                    {it.some((i) => i.kind === "club") && <i style={{ background: "#E8750A" }} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="dh">
          {DAYN[sel.getDay()]} {sel.getDate()} {MON[sel.getMonth()]}
          <small>
            {n ? n + " study " + (n > 1 ? "events" : "event") + " on" : "No study events on this day"}
          </small>
        </div>
        <div className="agenda">
          {its.length ? (
            its.map((i, idx) => <AgendaRow key={idx} it={i} dk={S.day} />)
          ) : (
            <div className="card empty">
              <b>Nothing on</b>
              <span>A good day to catch up solo. Check another day for a meetup.</span>
            </div>
          )}
        </div>
        <p className="note">Weekly meetups are big-group sessions for each subject. They do not replace tutorials.</p>
      </>
    );
  }

  return (
    <>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={S.dtab === "people"} onClick={() => A.dtab("people")}>
          People
        </button>
        <button role="tab" aria-selected={S.dtab === "sessions"} onClick={() => A.dtab("sessions")}>
          Study sessions
        </button>
      </div>
      <div className="pad px fade" style={{ paddingTop: 14 }}>
        {body}
      </div>
    </>
  );
}
