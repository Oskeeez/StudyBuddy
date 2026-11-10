/* Buddy the sticky-note mascot. Peely is the default; the others show up when Buddy is saying something specific.
   All four are drawn around the same origin (0,0 = centre of the note) so swapping moods never moves the face. */

export type Mood = "peely" | "tick" | "hmm" | "yay";

const INK = "#0F2D5E";
const S = `stroke="${INK}" stroke-linejoin="round" stroke-linecap="round"`;

/* the note: rounded square with the bottom-right corner folded over */
const NOTE = "M-76-90H76Q90-90 90-76V43.2L43.2 90H-76Q-90 90-90 76V-76Q-90-90-76-90Z";
const BAND = "M-90-61.2V-76Q-90-90-76-90H76Q90-90 90-76V-61.2Z";

const base = `<path d="${NOTE}" fill="#FFE680"/><path d="${BAND}" fill="#FFD84D" opacity=".55"/><path d="${NOTE}" fill="none" ${S} stroke-width="6"/><path d="M90 43.2L43.2 90V43.2Z" fill="#FFD84D" ${S} stroke-width="6"/>`;
const cheek = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="7.8" fill="#FF8FB1" opacity=".9"/>`;
const wrap = (inner: string, behind = "") => `${behind}<g transform="rotate(-3)">${inner}</g>`;

/* Peely: the default, calm and a little curious */
const PEELY = wrap(
  `${base}${cheek(-45.6, 24)}${cheek(45.6, 24)}<circle cx="-24" cy="6" r="7.8" fill="${INK}"/><circle cx="-21.6" cy="3.4" r="2.6" fill="#fff"/><circle cx="24" cy="6" r="7.8" fill="${INK}"/><circle cx="26.4" cy="3.4" r="2.6" fill="#fff"/><path d="M-13.2 20.4Q0 36 13.2 20.4" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
);

/* Tick: happy eyes plus a green check badge on the corner. For "found it in your files" / confirmed answers */
const TICK = wrap(
  `${base}${cheek(-48, 25.2)}${cheek(48, 25.2)}<path d="M-36 9.6Q-25.2-6-14.4 9.6" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M14.4 9.6Q25.2-6 36 9.6" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-15.6 20.4Q0 51.6 15.6 20.4Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="0" cy="31.2" rx="7.2" ry="4.1" fill="#FF8FB1"/><circle cx="86" cy="-86" r="28" fill="#BDEBD3" ${S} stroke-width="6"/><path d="M74-85L83-75L99-96" fill="none" ${S} stroke-width="6.5"/>`,
);

/* Hmm: looking up and off to the side, wobbly line and thought dots. For "let's work through it" and "not in your files" */
const HMM_BEHIND = `<path d="M-62-128q12-20 24 0t24 0t24 0" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/><circle cx="104" cy="-104" r="5.5" fill="#FFD84D" ${S} stroke-width="4"/><circle cx="120" cy="-124" r="8" fill="#FFD84D" ${S} stroke-width="4"/><circle cx="142" cy="-152" r="11" fill="#FFD84D" ${S} stroke-width="4"/>`;
const HMM = wrap(
  `${base}<circle cx="-25" cy="2" r="13" fill="#fff" ${S} stroke-width="4.5"/><circle cx="-21" cy="-2" r="5.4" fill="${INK}"/>${cheek(-45.6, 26)}<circle cx="25" cy="2" r="13" fill="#fff" ${S} stroke-width="4.5"/><circle cx="29" cy="-2" r="5.4" fill="${INK}"/>${cheek(45.6, 26)}<ellipse cx="3" cy="34" rx="6.5" ry="8.5" fill="${INK}"/>`,
  HMM_BEHIND,
);

/* Yay: arms up, big grin, confetti. For wins: nothing due, all set */
const conf = (x: number, y: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="9" fill="${fill}" ${S} stroke-width="4"/>`;
const strip = (x: number, y: number, rot: number, fill: string) =>
  `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-9" y="-6" width="18" height="12" rx="3" fill="${fill}" ${S} stroke-width="4"/></g>`;
const YAY_CONFETTI = [
  conf(-138, -104, "#FFD84D"), strip(-78, -150, 57, "#D3C7F5"), conf(6, -166, "#BDEBD3"), strip(84, -144, 131, "#FFB3C7"),
  strip(142, -96, 168, "#BFD9FF"), strip(-154, -10, 205, "#BDEBD3"), conf(156, -6, "#D3C7F5"), conf(-30, -136, "#FFB3C7"),
  strip(50, -126, 316, "#FFD84D"),
].join("");
const YAY = wrap(
  `<path d="M-84 26Q-134 22-122-44" fill="none" ${S} stroke-width="7"/><path d="M84 26Q134 22 122-44" fill="none" ${S} stroke-width="7"/>${base}${cheek(-48, 25.2)}${cheek(48, 25.2)}<path d="M-36 9.6Q-25.2-6-14.4 9.6" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M14.4 9.6Q25.2-6 36 9.6" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-15.6 20.4Q0 51.6 15.6 20.4Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="0" cy="31.2" rx="7.2" ry="4.1" fill="#FF8FB1"/><circle cx="-122" cy="-56" r="19" fill="#FFD84D" ${S} stroke-width="6"/><circle cx="122" cy="-56" r="19" fill="#FFD84D" ${S} stroke-width="6"/>`,
  YAY_CONFETTI,
);

export const MASCOT: Record<Mood, string> = { peely: PEELY, tick: TICK, hmm: HMM, yay: YAY };

/* "full" leaves room for the extras (squiggle, confetti); "face" crops tight on the note for small avatars */
export const MASCOT_VIEWBOX = { full: "-125 -150 250 250", face: "-98 -98 196 196" } as const;
