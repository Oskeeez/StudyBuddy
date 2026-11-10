"use client";

import { useEffect, useState } from "react";
import { SUBJ, SYNC } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Icon, Mascot } from "./ui";

type Step = "welcome" | "login" | "allow" | "sync";

/* ---------- 1. welcome ---------- */
function Welcome({ next }: { next: () => void }) {
  return (
    <div className="ob ob-welcome fade">
      <Mascot />
      <div>
        <h1>
          Study
          <br />
          Buddy
        </h1>
        <p className="tag2">Find your people. Learn from your own course material.</p>
      </div>
      <div className="ob-steps">
        <div className="ob-step">
          <span className="n">1</span>
          <span>Connect your Canvas account</span>
        </div>
        <div className="ob-step">
          <span className="n">2</span>
          <span>Buddy reads your subjects and finds study partners</span>
        </div>
        <div className="ob-step">
          <span className="n">3</span>
          <span>Ask anything. Buddy guides you, it does not do the work for you</span>
        </div>
      </div>
      <div className="ob-cta">
        <button className="btn big" onClick={next}>
          Connect with Canvas
        </button>
      </div>
    </div>
  );
}

/* ---------- 2. Canvas-inspired sign-in (demo only, nothing is sent anywhere) ---------- */
function Login({ next, back }: { next: () => void; back: () => void }) {
  const [user, setUser] = useState("n1234567");
  const [pw, setPw] = useState("demo-password");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(next, 900);
    return () => clearTimeout(t);
  }, [busy, next]);

  return (
    <div className="lms fade">
      <div className="lms-hero">
        <div className="logo">
          <Icon n="cap" />
        </div>
        <h2>University learning portal</h2>
        <p>Sign in to connect your courses</p>
      </div>
      <form
        className="lms-card"
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
        }}
      >
        <h3>Log in</h3>
        <label>
          Student number
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="chk2">
          <input type="checkbox" defaultChecked /> Stay signed in
        </label>
        <button className="lms-btn" disabled={busy}>
          {busy ? "Signing in..." : "Log in"}
        </button>
        <button type="button" className="lms-link" onClick={back}>
          Back
        </button>
      </form>
    </div>
  );
}

/* ---------- 3. allow access ---------- */
function Allow({ next, cancel }: { next: () => void; cancel: () => void }) {
  return (
    <div className="lms fade">
      <div className="lms-hero">
        <div className="logo">
          <Icon n="cap" />
        </div>
        <h2>Allow Study Buddy?</h2>
        <p>Study Buddy is asking to connect to your account</p>
      </div>
      <div className="lms-card">
        <div className="lms-user">
          <span className="av s" style={{ background: "linear-gradient(135deg,#1F62D6,#13B5C8)" }}>
            ML
          </span>
          <span>
            Mia Lawson
            <small>Signed in as n1234567</small>
          </span>
        </div>
        <p className="lms-sub">Study Buddy will be able to</p>
        <div className="lms-perm yes">
          <Icon n="check" c="sm" />
          <span>See which subjects you are enrolled in</span>
        </div>
        <div className="lms-perm yes">
          <Icon n="check" c="sm" />
          <span>Download your course files so Buddy can answer from them</span>
        </div>
        <div className="lms-perm yes">
          <Icon n="check" c="sm" />
          <span>See assignment due dates</span>
        </div>
        <p className="lms-sub">Study Buddy will not</p>
        <div className="lms-perm no">
          <Icon n="x" c="sm" />
          <span>Submit work or post on your behalf</span>
        </div>
        <div className="lms-perm no">
          <Icon n="x" c="sm" />
          <span>Share your files or grades with other students</span>
        </div>
        <div className="lms-row">
          <button className="lms-btn ghost" onClick={cancel}>
            Cancel
          </button>
          <button className="lms-btn" onClick={next}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. sync animation ---------- */
function Sync() {
  const { A } = useStore();
  const [n, setN] = useState(0);
  const done = n >= SYNC.length;
  const total = SYNC.reduce((a, s) => a + s.items.reduce((b, i) => b + i[1], 0), 0);

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setN((x) => x + 1), n === 0 ? 900 : 1000);
    return () => clearTimeout(t);
  }, [n, done]);

  return (
    <div className="ob sync fade">
      <Mascot />
      <div>
        <h2>{done ? "You are all set, Mia" : "Reading your courses"}</h2>
        <p className="lead">
          {done
            ? "Buddy now knows your subjects and will answer from your own course material."
            : "Buddy is downloading your course files. This only happens once."}
        </p>
      </div>
      <div className="bar" aria-hidden="true">
        <i style={{ width: `${(n / SYNC.length) * 100}%` }} />
      </div>
      <div className="card">
        {SYNC.map((s, i) => {
          const state = i < n ? "done" : i === n ? "busy" : "wait";
          const count = s.items.reduce((a, b) => a + b[1], 0);
          return (
            <div className={`srow ${state === "wait" ? "wait" : ""}`} key={s.k}>
              <i className="c" style={{ background: SUBJ[s.k].c }} />
              <div className="m">
                <b>
                  {s.k} {SUBJ[s.k].n}
                </b>
                <span>
                  {state === "done"
                    ? s.items.map(([l, c]) => `${c} ${l}`).join(" · ")
                    : state === "busy"
                      ? "Downloading files..."
                      : "Waiting"}
                </span>
              </div>
              <span className="st" aria-label={state === "done" ? `${count} files synced` : undefined}>
                {state === "done" && <Icon n="check" />}
                {state === "busy" && <span className="spin" />}
              </span>
            </div>
          );
        })}
      </div>
      {done ? (
        <>
          <p className="total">
            {SYNC.length} subjects · {total} files synced
          </p>
          <button className="btn big" onClick={A.enter}>
            Open Study Buddy
          </button>
        </>
      ) : null}
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState<Step>("welcome");
  if (step === "welcome") return <Welcome next={() => setStep("login")} />;
  if (step === "login")
    return <Login next={() => setStep("allow")} back={() => setStep("welcome")} />;
  if (step === "allow") return <Allow next={() => setStep("sync")} cancel={() => setStep("welcome")} />;
  return <Sync />;
}
