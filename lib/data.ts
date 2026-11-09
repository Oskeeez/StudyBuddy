/* All fictional demo content, ported from the original single-file mockup. */
import { dkey } from "./dates";

/* ---------- icons (24x24 stroke paths) ---------- */
export const IC: Record<string, string> = {
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
  discover:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16.5 4.8a3.4 3.4 0 0 1 0 6.4M18.5 14.8c1.8.7 3 2.4 3.4 5.2"/>',
  collab:
    '<path d="M20 12a8 8 0 0 1-11.6 7.1L3.5 20.5l1.5-4.4A8 8 0 1 1 20 12Z"/><path d="M8.5 11.5h7M8.5 14.5h4"/>',
  buddy:
    '<rect x="5" y="8" width="14" height="11" rx="4.500"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1"/><path d="M9.500 13v1.200M14.500 13v1.200"/><path d="M3 12.500v3M21 12.500v3"/>',
  spark:
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 21h4"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  send: '<path d="M3 11.5 21 3l-8.5 18-2.2-7.3Z"/>',
  check: '<path d="M5 12.500 10 17.500 19 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  arrow: '<path d="M9 5l7 7-7 7"/>',
  reply: '<path d="M9 8 4 13l5 5"/><path d="M4 13h9a7 7 0 0 1 7 7"/>',
  help: '<path d="M7 11v9H4v-9ZM7 12l4-8c1.700 0 2.500 1.200 2 3l-.5 3H19a2 2 0 0 1 2 2.300l-1 6A2 2 0 0 1 18 20H7"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2Z"/><path d="M4 20a2 2 0 0 0 2 1h13"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.6.5 1 1.200 1 2.100h5c0-.9.4-1.600 1-2.100A6 6 0 0 0 12 3Z"/>',
  group:
    '<circle cx="12" cy="9" r="3"/><path d="M6 20c.5-3 2.800-4.500 6-4.500s5.500 1.500 6 4.500"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/>',
  pin: '<path d="M12 21v-7M8 4h8l-1 6 3 3H6l3-3Z"/>',
  shield:
    '<path d="M12 3l8 3v6c0 4.500-3.300 7.800-8 9-4.700-1.200-8-4.500-8-9V6Z"/><path d="M9 12l2.200 2.200L15.500 10"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  cal: '<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  pinloc:
    '<path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z"/><circle cx="12" cy="9.500" r="2.500"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  cam: '<path d="M4 8h3l1.500-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.500"/>',
  repeat:
    '<path d="M17 3l3 3-3 3"/><path d="M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3"/><path d="M20 13v2a3 3 0 0 1-3 3H4"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5Z"/><path d="M6 11.500V16c0 1.500 2.700 3 6 3s6-1.500 6-3v-4.500"/><path d="M22 9v6"/>',
};

/* ---------- fake Canvas sync: what Buddy "reads" from each subject ---------- */
export const SYNC: { k: SubjKey; items: [string, number][] }[] = [
  { k: "EGB275", items: [["lecture slides", 14], ["tutorial sheets", 7], ["readings", 5]] },
  { k: "EGB270", items: [["lecture slides", 12], ["lab notes", 4], ["readings", 6]] },
  { k: "EGB273", items: [["lecture slides", 11], ["assessment briefs", 3], ["readings", 4]] },
  { k: "BSB105", items: [["lecture slides", 10], ["case studies", 4], ["readings", 5]] },
];

/* Buddy the robot mascot (original drawing) */
export const MASCOT_INNER = `
<ellipse cx="30" cy="108" rx="13" ry="22" fill="#3A64C8" stroke="#0F2D5E" stroke-width="5"/><ellipse cx="170" cy="108" rx="13" ry="22" fill="#3A64C8" stroke="#0F2D5E" stroke-width="5"/>
<rect x="40" y="56" width="120" height="104" rx="46" fill="#fff" stroke="#0F2D5E" stroke-width="5"/>
<rect x="54" y="74" width="92" height="66" rx="30" fill="#0F2D5E"/>
<path d="M72 109q10-15 20 0M108 109q10-15 20 0" fill="none" stroke="#fff" stroke-width="5.500" stroke-linecap="round"/>
<path d="M92 124q8 8 16 0" fill="none" stroke="#8FE3D0" stroke-width="4.500" stroke-linecap="round"/>
<path d="M68 52v14q32 14 64 0V52" fill="#16397A" stroke="#0F2D5E" stroke-width="4" stroke-linejoin="round"/>
<path d="M100 18l70 24-70 24-70-24Z" fill="#0F2D5E" stroke="#0F2D5E" stroke-width="4" stroke-linejoin="round"/>
<path d="M100 42l56 8v22" fill="none" stroke="#F2B134" stroke-width="3.500" stroke-linecap="round"/><circle cx="156" cy="76" r="5" fill="#F2B134"/>
<ellipse cx="70" cy="166" rx="18" ry="10" fill="#fff" stroke="#0F2D5E" stroke-width="5"/><ellipse cx="130" cy="166" rx="18" ry="10" fill="#fff" stroke="#0F2D5E" stroke-width="5"/>`;

/* ---------- subjects ---------- */
export type SubjKey = "EGB275" | "EGB270" | "EGB273" | "BSB105";
export const SUBJ: Record<SubjKey, { n: string; c: string }> = {
  EGB275: { n: "Structural Analysis", c: "var(--c-275)" },
  EGB270: { n: "Materials", c: "var(--c-270)" },
  EGB273: { n: "Principles of Construction", c: "var(--c-273)" },
  BSB105: { n: "The Future Enterprise", c: "var(--c-105)" },
};
export const SUBJ_KEYS = Object.keys(SUBJ) as SubjKey[];

export const GRAD = [
  ["#1F62D6", "#13B5C8"],
  ["#0E8F8A", "#7BC96F"],
  ["#D9730D", "#F2B134"],
  ["#C2417A", "#F08A5D"],
  ["#3A55C8", "#4FA3F7"],
];

/* ---------- people ---------- */
export type Person = {
  id: string;
  campus: string;
  name: string;
  age: number;
  deg: string;
  subj: SubjKey[];
  tags: string[];
  badge?: string;
  why: string[];
};

/* people who have chosen to be visible in their subjects */
export const PEOPLE: Person[] = [
  {
    id: "sophie",
    campus: "Gardens Point",
    name: "Sophie Carter",
    age: 20,
    deg: "Civil Engineering + Finance",
    subj: ["EGB275", "EGB270"],
    tags: ["Visual learner", "Afternoons", "On campus"],
    badge: "Top match",
    why: [
      "Both in EGB275 and EGB270",
      "Sophie sketches diagrams to explain concepts, which suits how you learn",
      "You both study best on campus in the afternoon",
    ],
  },
  {
    id: "jordan",
    campus: "Gardens Point",
    name: "Jordan Ellis",
    age: 21,
    deg: "Civil Engineering · Year 2",
    subj: ["EGB270", "EGB275"],
    tags: ["Theory first", "Evenings", "Small groups"],
    why: [
      "Both in EGB270 and EGB275",
      "Jordan is confident with theory and you lean towards practical examples",
      "Both prefer small groups of 3 to 4",
    ],
  },
  {
    id: "mei",
    campus: "Kelvin Grove",
    name: "Mei Tanaka",
    age: 19,
    deg: "Business · Year 1",
    subj: ["BSB105"],
    tags: ["Talks it through", "Mornings", "Online"],
    why: [
      "Both in BSB105",
      "You both learn by talking ideas out loud",
      "Both free on Friday mornings",
    ],
  },
  {
    id: "liam",
    campus: "Kelvin Grove",
    name: "Liam O'Connor",
    age: 22,
    deg: "Civil Eng / Business · Year 3",
    subj: ["EGB273", "BSB105"],
    tags: ["Practice problems", "Afternoons", "On campus"],
    why: [
      "Both in EGB273 and BSB105",
      "Liam has done EGB273 group projects before",
      "Both enjoy working through practice problems together",
    ],
  },
  {
    id: "zara",
    campus: "Gardens Point",
    name: "Zara Ahmed",
    age: 20,
    deg: "Civil Engineering · Year 2",
    subj: ["EGB270", "EGB275"],
    tags: ["Reading", "Evenings", "Online"],
    why: [
      "Both in EGB270 and EGB275",
      "Zara makes detailed summaries she is happy to compare",
      "Both prefer evening sessions",
    ],
  },
];

/* private profile: only revealed after both people say yes */
export const PRIYA: Person = {
  id: "priya",
  campus: "Gardens Point",
  name: "Priya Sharma",
  age: 20,
  deg: "Civil Engineering · Year 2",
  subj: ["EGB275", "EGB273"],
  tags: ["Visual learner", "Afternoons", "On campus"],
  badge: "You both said yes",
  why: [
    "Both in EGB275 and EGB273",
    "Priya draws diagrams to explain concepts, which suits how you learn",
    "You both study best on campus on Tuesday and Thursday afternoons",
  ],
};

export const ALL_PEOPLE: Person[] = [...PEOPLE, PRIYA];
export const pById = (id: string) => ALL_PEOPLE.find((p) => p.id === id)!;
export const pIndex = (p: Person) => ALL_PEOPLE.indexOf(p);

export const HOOK: Record<string, string> = {
  sophie: "Sketches diagrams, like you",
  jordan: "Strong on theory",
  mei: "Learns by talking it out",
  liam: "Has done EGB273 projects",
  zara: "Makes great summaries",
  priya: "Draws diagrams to explain",
};
export const SHORT: Record<string, string> = {
  sophie: "Civil Eng + Finance",
  jordan: "Civil Eng · Year 2",
  mei: "Business · Year 1",
  liam: "Civil Eng / Business",
  zara: "Civil Eng · Year 2",
  priya: "Civil Eng · Year 2",
};

/* ---------- timetable, meetups, club events ---------- */
export type Meet = {
  id: number;
  subj: SubjKey;
  wd: number;
  s: string;
  e: string;
  loc: string;
  base: number;
};
export const MEET: Meet[] = [
  { id: 1, subj: "EGB275", wd: 5, s: "12:00", e: "14:00", loc: "Gardens Point, Library Level 4", base: 23 },
  { id: 2, subj: "EGB270", wd: 3, s: "10:30", e: "12:00", loc: "Online (Teams)", base: 31 },
  { id: 3, subj: "EGB273", wd: 4, s: "12:30", e: "14:00", loc: "Kelvin Grove, Study Hub", base: 18 },
  { id: 4, subj: "BSB105", wd: 2, s: "12:30", e: "14:00", loc: "Gardens Point, Level 5 Hub", base: 27 },
];

export type ClassItem = {
  subj: SubjKey;
  type: string;
  wd: number;
  s: string;
  e: string;
  loc: string;
};
export const CLASSES: ClassItem[] = [
  { subj: "EGB275", type: "Lecture", wd: 1, s: "09:00", e: "11:00", loc: "Gardens Point" },
  { subj: "EGB273", type: "Tutorial", wd: 1, s: "13:00", e: "15:00", loc: "Kelvin Grove" },
  { subj: "BSB105", type: "Lecture", wd: 2, s: "10:00", e: "12:00", loc: "Gardens Point" },
  { subj: "EGB270", type: "Lecture", wd: 3, s: "08:00", e: "10:00", loc: "Gardens Point" },
  { subj: "EGB273", type: "Lecture", wd: 3, s: "13:00", e: "15:00", loc: "Kelvin Grove" },
  { subj: "EGB275", type: "Tutorial", wd: 4, s: "09:00", e: "11:00", loc: "Gardens Point" },
  { subj: "BSB105", type: "Tutorial", wd: 5, s: "09:00", e: "10:00", loc: "Gardens Point" },
];

export type ClubEvent = {
  id: string;
  club: string;
  t: string;
  s: string;
  e: string;
  loc: string;
  going: number;
  who: string[];
};
export const EVENTS: Record<string, ClubEvent[]> = {
  "2026-11-13": [
    { id: "e1", club: "Civil Engineering Society", t: "Friday night social", s: "18:00", e: "21:00", loc: "Gardens Point, Student Hub", going: 14, who: ["sophie", "jordan", "zara"] },
  ],
  "2026-11-10": [
    { id: "e2", club: "Business Society", t: "Coffee and careers chat", s: "17:30", e: "19:00", loc: "Gardens Point, Level 5 Hub", going: 9, who: ["mei", "liam"] },
  ],
};

export type AgendaItem =
  | ({ kind: "class" } & ClassItem)
  | ({ kind: "meetup"; dk: string; fits: boolean } & Meet)
  | ({ kind: "club" } & ClubEvent);

export function itemsFor(d: Date): AgendaItem[] {
  const wd = d.getDay();
  const k = dkey(d);
  const cl: AgendaItem[] = CLASSES.filter((c) => c.wd === wd).map((c) => ({ kind: "class" as const, ...c }));
  const mt: AgendaItem[] = MEET.filter((m) => m.wd === wd).map((m) => ({
    kind: "meetup" as const,
    ...m,
    dk: k,
    fits: !CLASSES.filter((c) => c.wd === wd).some((c) => m.s < c.e && m.e > c.s),
  }));
  const ev: AgendaItem[] = (EVENTS[k] || []).map((e) => ({ kind: "club" as const, ...e }));
  return [...cl, ...mt, ...ev].sort((a, b) => a.s.localeCompare(b.s));
}

/* ---------- to do, board posts, chats ---------- */
export type Todo = {
  id: number;
  due: string;
  subj: SubjKey;
  t: string;
  s: string;
  nudge: string;
  act: string;
  to: [string, string, string];
};
export const TODO: Todo[] = [
  {
    id: 1,
    due: "2026-11-09T23:59",
    subj: "EGB273",
    t: "Assessment 2: workforce section draft",
    s: "Due Mon 9 Nov, 11:59 pm",
    nudge: "Start with a five-bullet outline. That is enough to get moving, and you can fill it in tomorrow.",
    act: "See Thursday’s EGB273 meetup",
    to: ["discover", "sessions", "2026-11-12"],
  },
  {
    id: 2,
    due: "2026-11-10T09:00",
    subj: "EGB275",
    t: "Tutorial 7 problems",
    s: "Due Tue 10 Nov, 9:00 am",
    nudge: "Stuck on a question? Someone may have already asked it. Search the board before you spend an hour on it.",
    act: "Search the board",
    to: ["collaborate", "board", "EGB275"],
  },
  {
    id: 3,
    due: "2026-11-13T17:00",
    subj: "BSB105",
    t: "Case study reflection",
    s: "Due Fri 13 Nov, 5:00 pm",
    nudge: "Say your main idea out loud first. If it sounds clear to you, writing it up takes ten minutes.",
    act: "See Tuesday’s BSB105 meetup",
    to: ["discover", "sessions", "2026-11-10"],
  },
];

export type Post = {
  id: number;
  subj: SubjKey;
  time: string;
  q: string;
  helpful: number;
  cm: { t: string }[];
  tutor: string | null;
};
export const POSTS: Post[] = [
  {
    id: 1,
    subj: "EGB275",
    time: "2h",
    q: "Anyone else confused about when to use the moment-area method instead of double integration for deflections?",
    helpful: 5,
    cm: [{ t: "Moment-area is quicker when you only need deflection at one point. Double integration gives you the whole curve." }],
    tutor: "Good question. Use moment-area when you need a single point and the M/EI diagram is simple. Bring one example to Tuesday and we will go through both.",
  },
  {
    id: 2,
    subj: "BSB105",
    time: "5h",
    q: "Is the case study for Assessment 2 meant to use a framework from week 4, or can we pick our own?",
    helpful: 2,
    cm: [],
    tutor: null,
  },
  {
    id: 3,
    subj: "EGB273",
    time: "1d",
    q: "How detailed does the construction sequence need to be in the program? Activity level or task level?",
    helpful: 8,
    cm: [
      { t: "Ours was activity level with durations. Our tutor said that was enough as long as the critical path is clear." },
      { t: "Same. Do not forget the lead time for turbine delivery." },
    ],
    tutor: null,
  },
  {
    id: 4,
    subj: "EGB270",
    time: "1d",
    q: "What is the difference between yield strength and ultimate tensile strength on the stress-strain curve?",
    helpful: 11,
    cm: [{ t: "Yield is where permanent deformation starts. Ultimate is the highest stress the material reaches before it starts necking." }],
    tutor: null,
  },
  {
    id: 5,
    subj: "EGB275",
    time: "2d",
    q: "How do I find fixed-end moments for a propped cantilever with a point load?",
    helpful: 6,
    cm: [],
    tutor: "Treat the prop as a redundant, release it, then use compatibility of deflection at that point. The tutorial 5 worked solution covers this exact case.",
  },
];

export type Msg = { t: string; me?: number; n?: string };
export type Thread = {
  name: string;
  i: number;
  kind: "dm" | "group";
  last: string;
  time: string;
  unread?: boolean;
  active?: boolean;
  msgs: Msg[];
};
export const THREADS: Record<string, Thread> = {
  sophie: {
    name: "Sophie Carter",
    i: 0,
    kind: "dm",
    last: "Tuesday works for me, library L4?",
    time: "8:12",
    unread: true,
    active: true,
    msgs: [
      { t: "Hey! Saw we are both in EGB275 and EGB270" },
      { t: "Want to do the tutorial 7 problems together?", me: 1 },
      { t: "Yes please, I keep getting stuck on the fixed-end moments" },
      { t: "Tuesday works for me, library L4?" },
    ],
  },
  jordan: {
    name: "Jordan Ellis",
    i: 1,
    kind: "dm",
    last: "I can share my materials notes before Wednesday",
    time: "Fri",
    msgs: [
      { t: "Hi Jordan, are you coming to the EGB270 meetup?", me: 1 },
      { t: "Yep! I can share my materials notes before Wednesday" },
    ],
  },
  g275: {
    name: "EGB275 Study Group",
    i: 4,
    kind: "group",
    last: "Zara: has anyone done Q4 yet?",
    time: "Thu",
    unread: true,
    msgs: [
      { n: "Sophie", t: "Sunday check-in everyone? Quick 30 min" },
      { n: "Zara", t: "has anyone done Q4 yet?" },
    ],
  },
  g273: {
    name: "EGB273 Assessment 2 Crew",
    i: 2,
    kind: "group",
    last: "You: I will send the workforce section tonight",
    time: "Wed",
    msgs: [
      { n: "Liam", t: "Who is doing the risk table?" },
      { t: "I will send the workforce section tonight", me: 1 },
    ],
  },
  g105: {
    name: "BSB105 All Welcome",
    i: 3,
    kind: "group",
    last: "Mei: Friday case study session is on",
    time: "Tue",
    msgs: [{ n: "Mei", t: "Friday case study session is on" }],
  },
};

/* ---------- Buddy tips on the home and sessions screens ---------- */
export type Tip = { k: "tips" | "say" | "club"; h: string; text: string; cta: string; who: string[] };
export const TIPS: Tip[] = [
  {
    k: "tips",
    h: "Ease into your first meetup",
    text: "We noticed you have not been to a study session yet. 23 other EGB275 students are going on Friday, and it fits your timetable. Want a few pointers so walking in feels easier?",
    cta: "Show me pointers",
    who: [],
  },
  {
    k: "say",
    h: "Know a few faces before you go",
    text: "3 students going to Friday’s EGB275 meetup suit your learning style and interests. Would you like to message them first, so you know a few people before you arrive?",
    cta: "Message them",
    who: ["sophie", "jordan", "zara"],
  },
  {
    k: "club",
    h: "Meet people somewhere relaxed",
    text: "Civil Engineering Society has a social this Friday night, and 14 students from your subjects are members. A low-pressure way to meet future study buddies before a study session.",
    cta: "See the event",
    who: ["sophie", "jordan"],
  },
];
export const SAYP = [
  "Say who you are and which subject you share.",
  "Ask one specific question about the subject. It is an easier place to start.",
  "Write it in your own words. A short, genuine message works best.",
];
export const CPTS = [
  "Keep it short. Say who you are and what you share.",
  "Start with the subject. It is an easier place to begin.",
  "A slow reply is normal. You can follow up later.",
];
export const PTS = [
  "Arrive 5 to 10 minutes early. A half-empty room is easier to walk into.",
  "Think of one easy question about the subject to ask someone.",
  "You do not have to stay the whole time. Twenty minutes still counts.",
];
