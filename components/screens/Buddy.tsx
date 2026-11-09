"use client";

import { useStore } from "@/lib/store";
import { Icon, Mascot } from "../ui";

const FEATURES: [string, string, string][] = [
  ["book", "Knows your subjects", "Answers use your actual lecture slides, tutorial notes and subject outlines."],
  ["bulb", "Guides, does not just answer", "Asks questions and gives hints so you work it out yourself."],
  ["check", "Shows its sources", "Points to the slide or recording it used, and says when the course material does not cover something."],
  ["group", "Powers better matches", "With your consent, learning insights can help suggest study partners."],
];

/* Placeholder screen: the real Buddy chat mounts into #buddy-mount in a later phase. */
export default function Buddy() {
  const { A } = useStore();
  return (
    <div className="pad px fade">
      <div className="ph" id="buddy-mount">
        <Mascot />
        <h2>Hi, I&apos;m Buddy</h2>
        <p className="ask">Ask with confidence.</p>
        <p style={{ color: "var(--muted)", maxWidth: "30ch" }}>
          Your QUT course-aware study tutor is coming soon. This space is reserved for the Buddy chat.
        </p>
        <code className="mount">Integration placeholder · #buddy-mount</code>
        <button className="btn" onClick={A.notify}>
          Notify me when it is ready
        </button>
      </div>
      <section>
        <div className="sec-h">
          <h2>What Buddy will do</h2>
        </div>
        <div className="card">
          {FEATURES.map((f) => (
            <div className="feat" key={f[1]}>
              <div className="ic">
                <Icon n={f[0]} />
              </div>
              <div>
                <b>{f[1]}</b>
                <span>{f[2]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
