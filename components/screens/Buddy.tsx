"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SUBJ_KEYS, SYNC, TODO, type SubjKey } from "@/lib/data";
import {
  SAMPLE_QUESTION,
  TOTAL_FILES,
  hoursLeft,
  moodOf,
  respond,
  route,
  suggest,
  type FlowId,
  type Reply,
} from "@/lib/buddy";
import { useStore } from "@/lib/store";
import BuddyCard, { Sources } from "../buddy-cards";
import { Icon, Mascot } from "../ui";

type UMsg = { id: number; role: "user"; text: string };
type BMsg = { id: number; role: "buddy"; reply: Reply };
type Msg = UMsg | BMsg;

const wordsOf = (s: string) => s.split(" ").filter(Boolean);
const countWords = (r: Reply) => r.text.reduce((a, t) => a + wordsOf(t).length, 0) + (r.list || []).reduce((a, t) => a + wordsOf(t).length, 0);
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- one Buddy reply: text streams in, then sources, card and follow-ups appear ---------- */
function BuddyMessage({
  m,
  last,
  onSend,
  onRescope,
  onGrow,
}: {
  m: BMsg;
  last: boolean;
  onSend: (t: string, f?: FlowId) => void;
  onRescope: (t: string, f: FlowId) => void;
  onGrow: () => void;
}) {
  const r = m.reply;
  const total = useMemo(() => countWords(r), [r]);
  const [shown, setShown] = useState(() => (prefersReduced() ? total : 0));
  const done = shown >= total;

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setShown((s) => Math.min(total, s + 3)), 26);
    return () => clearInterval(t);
  }, [done, total]);

  useEffect(() => {
    onGrow();
  }, [shown, done, onGrow]);

  let left = shown;
  const take = (text: string) => {
    const w = wordsOf(text);
    const n = Math.min(w.length, left);
    left -= n;
    return n > 0 ? w.slice(0, n).join(" ") : null;
  };
  const paras = r.text.map(take);
  const items = (r.list || []).map(take);

  return (
    <div className="bb fade">
      <div className="bot">
        <Mascot fit="face" mood={moodOf(r)} />
      </div>
      <div className="bbody">
        <div className="bname">
          Buddy
          {r.guide && (
            <span className="gbadge">
              <Icon n="spark" c="sm" />
              Working it through
            </span>
          )}
        </div>
        {paras.map((p, i) => p && <p key={i}>{p}</p>)}
        {r.list && items.some(Boolean) && (
          <ol>
            {items.map((it, i) => it && <li key={i}>{it}</li>)}
          </ol>
        )}
        {done && (
          <>
            {r.sources && <Sources sources={r.sources} />}
            {r.card && <BuddyCard card={r.card} onSend={onSend} onRescope={onRescope} />}
            {last && r.follow.length > 0 && (
              <div className="follow fade">
                {r.follow.map((f) => (
                  <button className="fchip" key={f.label} onClick={() => onSend(f.label, f.flow)}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- the screen ---------- */
export default function Buddy({ active }: { active: boolean }) {
  const { S } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState<string | null>(null);
  const [scope, setScope] = useState<"All" | SubjKey>("All");
  const [scopeOpen, setScopeOpen] = useState(false);
  const nid = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const busy = thinking !== null;

  const sugg = useMemo(() => suggest(S.done, S.joined).slice(0, 2), [S.done, S.joined]);
  const soon = TODO.filter((t) => !S.done.has(t.id) && hoursLeft(t.due) > 0 && hoursLeft(t.due) <= 72).sort((a, b) =>
    a.due.localeCompare(b.due),
  );
  const ctxLine = soon.length
    ? `${soon.length} ${soon.length > 1 ? "things" : "thing"} due in the next 3 days. Next up: ${soon[0].t}.`
    : "Nothing due in the next 3 days. A good time to get ahead.";

  const toBottom = useCallback(() => {
    const e = scrollRef.current;
    if (e) e.scrollTop = e.scrollHeight;
  }, []);

  useEffect(() => {
    const e = scrollRef.current;
    if (!e) return;
    if (msgs.length || thinking) toBottom();
    else e.scrollTop = 0;
  }, [msgs.length, thinking, active, toBottom]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const send = useCallback(
    (text: string, flow?: FlowId, scopeOverride?: "All" | SubjKey) => {
      const t = text.trim();
      if (!t || thinking !== null) return;
      const f = flow ?? route(t);
      const reply = respond(f, t, { scope: scopeOverride ?? scope, done: S.done, joined: S.joined });
      setMsgs((m) => [...m, { id: nid.current++, role: "user", text: t }]);
      setInput("");
      setScopeOpen(false);
      const src = reply.sources?.[0];
      setThinking(src ? `Reading ${src.label}` : "Searching your course files");
      setTimeout(() => {
        setMsgs((m) => [...m, { id: nid.current++, role: "buddy", reply }]);
        setThinking(null);
      }, 1100);
    },
    [scope, S.done, S.joined, thinking],
  );

  const rescope = (text: string, flow: FlowId) => {
    setScope("All");
    send(text, flow, "All");
  };

  const scopeLabel =
    scope === "All" ? `Answering from ${SYNC.length} subjects · ${TOTAL_FILES} files` : `Answering from ${scope} only`;
  const last = msgs.length ? msgs[msgs.length - 1] : null;

  return (
    <div className="bchat">
      <div className="bscroll px" ref={scrollRef}>
        {msgs.length === 0 && !busy ? (
          <div className="bempty fade">
            <div className="bhello">
              <Mascot />
              <div>
                <h2>Hi Anusha</h2>
                <p className="bctx">{ctxLine}</p>
              </div>
            </div>
            <span className="bsync">
              <Icon n="check" c="sm" />
              Synced from Canvas · {SYNC.length} subjects · {TOTAL_FILES} files
            </span>
            <p className="lab" style={{ margin: "6px 0 0" }}>
              Suggested for you
            </p>
            <div className="bsug">
              {sugg.map((s) => (
                <button className="sug" key={s.id} onClick={() => send(s.prompt, s.flow)}>
                  <span className="sug-top">
                    <span className={`rtag ${s.kind}`}>{s.reason}</span>
                    <Icon n="arrow" c="sm" />
                  </span>
                  <b>{s.prompt}</b>
                </button>
              ))}
            </div>
            <button className="btry" onClick={() => setInput(SAMPLE_QUESTION)}>
              <Icon n="shield" c="sm" />
              Paste an assignment question to see guided practice
            </button>
          </div>
        ) : (
          <>
            {msgs.map((m) =>
              m.role === "user" ? (
                <div className="bu fade" key={m.id}>
                  {m.text}
                </div>
              ) : (
                <BuddyMessage
                  key={m.id}
                  m={m}
                  last={last?.id === m.id}
                  onSend={(t, f) => send(t, f)}
                  onRescope={rescope}
                  onGrow={toBottom}
                />
              ),
            )}
            {busy && (
              <div className="bb fade">
                <div className="bot">
                  <Mascot fit="face" mood="hmm" />
                </div>
                <div className="think">
                  <span>{thinking}</span>
                  <span className="dots3" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bcomp px">
        <div className="bscope">
          <button className="scope" onClick={() => setScopeOpen((o) => !o)} aria-expanded={scopeOpen}>
            <Icon n="book" c="sm" />
            {scopeLabel}
            <Icon n="arrow" c="sm" />
          </button>
          {msgs.length > 0 && (
            <button
              className="newc"
              onClick={() => {
                setMsgs([]);
                setThinking(null);
              }}
            >
              New chat
            </button>
          )}
        </div>
        {scopeOpen && (
          <div className="chiprow fade">
            {(["All", ...SUBJ_KEYS] as ("All" | SubjKey)[]).map((k) => (
              <button
                key={k}
                className="chip"
                aria-pressed={scope === k}
                onClick={() => {
                  setScope(k);
                  setScopeOpen(false);
                }}
              >
                {k === "All" ? "All subjects" : k}
              </button>
            ))}
          </div>
        )}
        <form
          className="bform"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <textarea
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about your courses..."
            aria-label="Message Buddy"
          />
          <button className="bsend" disabled={!input.trim() || busy} aria-label="Send">
            <Icon n="send" c="sm" />
          </button>
        </form>
      </div>
    </div>
  );
}
