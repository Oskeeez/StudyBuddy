"use client";

import { SUBJ, SUBJ_KEYS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { THEMES, useTheme } from "@/lib/theme";
import { Icon, Mascot } from "../ui";

const GROUPS: Record<string, string[]> = {
  "How I learn": ["Visual", "Talking it through", "Practice problems", "Reading"],
  "When I study": ["Mornings", "Afternoons", "Evenings"],
  Format: ["On campus", "Online", "Small groups"],
};

/* picked by picture, not words; the label stays as the tooltip and screen reader name */
const PICK_ICON: Record<string, string> = {
  Visual: "pv_visual",
  "Talking it through": "pv_talk",
  "Practice problems": "pv_practice",
  Reading: "pv_read",
  Mornings: "pv_morning",
  Afternoons: "pv_afternoon",
  Evenings: "pv_night",
  "On campus": "pv_campus",
  Online: "pv_online",
  "Small groups": "pv_groups",
};

const PRIVACY: ["visible" | "buddy", string, string][] = [
  ["visible", "Show me to students in my subjects", "Only people enrolled in the same subjects can see you."],
  ["buddy", "Use Buddy insights for matching", "Lets Buddy share how you learn, never your answers or grades."],
];

export default function Profile() {
  const { S, A } = useStore();
  const { theme, setTheme } = useTheme();
  return (
    <div className="fade prof">
      <div className="px" style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 14, paddingBottom: 28 }}>
        <div className="pid">
          <div className="who">
            <h2>Anusha Lawson</h2>
            <p>Civil Engineering · Year 2</p>
          </div>
          <Mascot />
        </div>

        <section>
          <p className="lab">This semester</p>
          <div className="subgrid">
            {SUBJ_KEYS.map((k) => (
              <div className="subtile" key={k} style={{ ["--c" as string]: SUBJ[k].c }}>
                <b>{k}</b>
                <span>{SUBJ[k].n}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="lab">How I study</p>
          <div className="card pcard">
            {Object.entries(GROUPS).map(([g, a]) => (
              <div className="pblock" key={g}>
                <p className="sub">{g}</p>
                <div className="picks">
                  {a.map((x) => (
                    <button
                      key={x}
                      className="pick"
                      aria-pressed={S.prefs.has(x)}
                      aria-label={x}
                      title={x}
                      onClick={() => A.pref(x)}
                    >
                      <Icon n={PICK_ICON[x]} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="lab">Settings</p>
          <div className="card set themes pcard" role="group">
            <div className="pblock">
              <p className="sub">Appearance</p>
            </div>
            <div role="radiogroup" aria-label="Colour theme">
              {THEMES.map((t) => (
                <button key={t.id} className="row" role="radio" aria-checked={theme === t.id} onClick={() => setTheme(t.id)}>
                  <span className="sw" aria-hidden="true">
                    {t.swatch.map((c) => (
                      <i key={c} style={{ background: c }} />
                    ))}
                  </span>
                  <span className="m">
                    <b>{t.label}</b>
                    <span>{t.note}</span>
                  </span>
                  <span className="ck" aria-hidden="true">
                    <Icon n="check" c="sm" />
                  </span>
                </button>
              ))}
            </div>
            <div className="pblock">
              <p className="sub">Privacy</p>
            </div>
            {PRIVACY.map(([k, t, d]) => (
              <button key={k} className="row" role="switch" aria-checked={S.priv[k]} onClick={() => A.priv(k)}>
                <span className="m">
                  <b>{t}</b>
                  <span>{d}</span>
                </span>
                <span className="tg" />
              </button>
            ))}
            <div className="pblock">
              <p className="sub">Canvas</p>
            </div>
            <button className="row" onClick={A.signOut}>
              <span className="m">
                <b>Connected to Canvas</b>
                <span>Tap to disconnect.</span>
              </span>
            </button>
          </div>
        </section>

        <p className="note">No followers, no rankings. Study Buddy is about working together, not popularity.</p>
      </div>
    </div>
  );
}
