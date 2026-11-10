import { GRAD, IC, SUBJ, type SubjKey } from "@/lib/data";
import { MASCOT, MASCOT_VIEWBOX, type Mood } from "@/lib/mascot";

export function Icon({ n, c = "" }: { n: string; c?: string }) {
  return (
    <svg
      className={`ico ${c}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: IC[n] }}
    />
  );
}

/* Buddy's sticky-note mascot. Peely unless a mood is passed. "face" crops tight for small avatars. */
export function Mascot({ c = "", mood = "peely", fit = "full" }: { c?: string; mood?: Mood; fit?: "full" | "face" }) {
  return (
    <svg
      className={`mascot ${c}`}
      viewBox={MASCOT_VIEWBOX[fit]}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: MASCOT[mood] }}
    />
  );
}

export function Avatar({
  name,
  size = "m",
  i = 0,
}: {
  name: string;
  size?: string;
  i?: number;
}) {
  const g = GRAD[i % GRAD.length];
  const ini = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`av ${size}`}
      style={{ background: `linear-gradient(135deg,${g[0]},${g[1]})` }}
    >
      {ini}
    </div>
  );
}

export function AnonAvatar({ s = "s" }: { s?: string }) {
  return (
    <div className={`av ${s} anon`}>
      <Icon n="user" c="sm" />
    </div>
  );
}

export function SubTag({ k }: { k: SubjKey }) {
  return (
    <span className="sub" style={{ background: SUBJ[k].c }}>
      {k}
    </span>
  );
}
