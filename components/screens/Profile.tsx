"use client";

import { SUBJ, SUBJ_KEYS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar } from "../ui";

const GROUPS: Record<string, string[]> = {
  "How I learn": ["Visual", "Talking it through", "Practice problems", "Reading"],
  "When I study": ["Mornings", "Afternoons", "Evenings"],
  Format: ["On campus", "Online", "Small groups"],
};

const PRIVACY: ["visible" | "buddy", string, string][] = [
  ["visible", "Show me to students in my subjects", "Only people enrolled in the same subjects can see you."],
  ["buddy", "Use Buddy insights for matching", "Lets Buddy share how you learn, never your answers or grades."],
];

export default function Profile() {
  const { S, A } = useStore();
  return (
    <div className="fade">
      <div className="cover" />
      <div className="px" style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 28 }}>
        <div className="pid">
          <Avatar name="Mia Lawson" size="l" i={0} />
          <h2>Mia Lawson</h2>
          <p>Civil Engineering · Year 2</p>
        </div>
        <section>
          <p className="lab">Subjects this semester</p>
          <div className="card">
            {SUBJ_KEYS.map((k) => (
              <div className="subrow" key={k}>
                <i style={{ background: SUBJ[k].c }} />
                <div>
                  <b>{k}</b>
                  <span>{SUBJ[k].n}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        {Object.entries(GROUPS).map(([g, a]) => (
          <section key={g}>
            <p className="lab">{g}</p>
            <div className="chips">
              {a.map((x) => (
                <button key={x} className="chip" aria-pressed={S.prefs.has(x)} onClick={() => A.pref(x)}>
                  {x}
                </button>
              ))}
            </div>
          </section>
        ))}
        <section>
          <p className="lab">Privacy</p>
          <div className="card set">
            {PRIVACY.map(([k, t, d]) => (
              <button
                key={k}
                className="row"
                role="switch"
                aria-checked={S.priv[k]}
                onClick={() => A.priv(k)}
              >
                <span className="m">
                  <b>{t}</b>
                  <span>{d}</span>
                </span>
                <span className="tg" />
              </button>
            ))}
          </div>
        </section>
        <section>
          <p className="lab">Canvas</p>
          <div className="card set">
            <button className="row" onClick={A.signOut}>
              <span className="m">
                <b>Connected to Canvas (demo)</b>
                <span>Tap to disconnect and replay the sign-in.</span>
              </span>
            </button>
          </div>
        </section>
        <p className="note">No followers, no rankings. Study Buddy is about working together, not popularity.</p>
      </div>
    </div>
  );
}
