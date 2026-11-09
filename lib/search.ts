import type { Post } from "./data";

/* Similar-question search: scores how many meaningful words overlap. */
const STOP = new Set(
  "the and for are but not you all any can had her was one our out how what when with that this have from they will would there their which about into than then them these some could other does did why who its has more also very just like need get got use using".split(
    " ",
  ),
);

export const toks = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

export function score(q: string, p: Post) {
  const a = new Set(toks(q));
  if (!a.size) return 0;
  const b = new Set(
    toks(p.q + " " + (p.tutor || "") + " " + p.cm.map((c) => c.t).join(" ")),
  );
  let n = 0;
  a.forEach((w) => {
    if (b.has(w)) n++;
  });
  return n / a.size;
}
