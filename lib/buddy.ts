/* Buddy's brain for the prototype: ranked suggestions, a keyword router and scripted replies.
   The logic is real (it reads the to-do list, usage history and meetups), the data is fictional.
   Later, live Claude calls replace `respond`. */
import { MEET, PEOPLE, SUBJ, SYNC, TODO, type Person, type SubjKey } from "./data";
import { DAYN } from "./dates";
import type { Mood } from "./mascot";

/* the demo is pinned to this moment so suggestions never change on the day: Sat 7 Nov 2026, 2:30 pm */
export const NOW = new Date(2026, 10, 7, 14, 30);
export const hoursLeft = (due: string) => (new Date(due).getTime() - NOW.getTime()) / 3.6e6;

export const TOTAL_FILES = SYNC.reduce((a, s) => a + s.items.reduce((b, i) => b + i[1], 0), 0);

/* ---------- types ---------- */
export type FlowId =
  | "outline" | "tut7" | "fem" | "meetup" | "case" | "yield"
  | "quiz275" | "quiz270" | "match" | "ladder" | "check" | "due" | "hello" | "oos";

export type Source = { subj: SubjKey; label: string };
export type Follow = { label: string; flow: FlowId };
export type Q = {
  q: string; options: string[]; answer: number; explain: string; source: Source;
  topic: string; // short name used in the quiz review
  revise: FlowId; // what to open if the student missed it
};
export type TodoItem = { id: number; t: string; s: string; subj: SubjKey; prompt: string; flow: FlowId };

export type Card =
  | { type: "ladder"; steps: { label: string; task: string; nudge: string }[]; example: { title: string; lines: string[]; note: string } }
  | { type: "quiz"; title: string; qs: Q[] }
  | { type: "match"; people: Person[]; note: string }
  | { type: "checklist"; title: string; items: string[]; finish: string }
  | { type: "formulas"; title: string; rows: { label: string; formula: string }[]; note: string }
  | { type: "due"; items: TodoItem[] }
  | { type: "scope"; retry: { text: string; flow: FlowId } }
  | { type: "nosource" };

export type Reply = {
  mood?: Mood; // overrides the mascot picked by moodOf()
  text: string[];
  list?: string[];
  sources?: Source[];
  guide?: boolean;
  card?: Card;
  follow: Follow[];
};

/* which mascot Buddy wears for a reply: Peely by default */
export function moodOf(r: Reply): Mood {
  if (r.mood) return r.mood;
  if (r.guide || r.card?.type === "scope" || r.card?.type === "nosource") return "hmm";
  if (r.sources?.length) return "tick";
  return "peely";
}

/* ---------- usage history (fictional) ---------- */
export const USAGE = {
  asked: [
    { topic: "fixed-end moments", subj: "EGB275" as SubjKey, times: 2 },
    { topic: "yield vs ultimate strength", subj: "EGB270" as SubjKey, times: 1 },
  ],
  studyHours: [12, 17] as [number, number], // usually studies 12 pm to 5 pm
};

/* ---------- suggestions ---------- */
export type Suggestion = {
  id: string;
  prompt: string;
  flow: FlowId;
  kind: "due" | "struggle" | "meetup" | "habit";
  reason: string;
  score: number;
  subj: SubjKey;
};

function dueLabel(due: string) {
  const d = new Date(due);
  const a = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()).getTime();
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((b - a) / 864e5);
  if (days <= 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return "Due " + DAYN[d.getDay()];
}

const TODO_PROMPT: Record<number, { prompt: string; flow: FlowId }> = {
  1: { prompt: "Help me outline my workforce section", flow: "outline" },
  2: { prompt: "Walk me through moment-area vs double integration", flow: "tut7" },
  3: { prompt: "Help me plan my case study reflection", flow: "case" },
};

/* every signal gets a score, the top few show. At most two "due" cards so other signals still appear. */
export function suggest(done: Set<number>, joined: Set<string>): Suggestion[] {
  const all: Suggestion[] = [];

  for (const t of TODO) {
    if (done.has(t.id)) continue;
    const h = hoursLeft(t.due);
    if (h <= 0 || h > 24 * 6) continue;
    all.push({ id: "due" + t.id, ...TODO_PROMPT[t.id], kind: "due", reason: dueLabel(t.due), score: 200 - h, subj: t.subj });
  }

  for (const u of USAGE.asked) {
    if (u.times >= 2) {
      all.push({
        id: "struggle-" + u.topic,
        prompt: "Give me a 5-minute recap of " + u.topic,
        flow: "fem",
        kind: "struggle",
        reason: "You asked about this twice",
        score: u.times * 45,
        subj: u.subj,
      });
    }
  }

  const m = MEET[0];
  const going = joined.has(m.id + "|2026-11-13");
  all.push({
    id: "meetup",
    prompt: "Prep me for Friday's " + m.subj + " meetup",
    flow: "meetup",
    kind: "meetup",
    reason: going ? "You are going Friday" : "Meetup Friday",
    score: going ? 85 : 60,
    subj: m.subj,
  });

  const hr = NOW.getHours();
  if (hr >= USAGE.studyHours[0] && hr < USAGE.studyHours[1]) {
    all.push({
      id: "habit",
      prompt: "Quiz me on materials",
      flow: "quiz270",
      kind: "habit",
      reason: "Your usual study time",
      score: 40,
      subj: "EGB270",
    });
  }

  all.sort((a, b) => b.score - a.score);
  const cap = { due: 2, struggle: 1, meetup: 1, habit: 1 };
  const used = { due: 0, struggle: 0, meetup: 0, habit: 0 };
  const out: Suggestion[] = [];
  for (const s of all) {
    if (used[s.kind] >= cap[s.kind]) continue;
    used[s.kind]++;
    out.push(s);
    if (out.length === 4) break;
  }
  return out;
}

/* ---------- routing typed messages ---------- */
/* Looks like a question pulled from an assessment: units plus an instruction, a long pasted block, or "Question 3 (6 marks)" */
export function assessmentLike(text: string) {
  const s = text.toLowerCase();
  const words = s.split(/\s+/).filter(Boolean).length;
  const verb = /\b(calculate|determine|find|show that|derive|compute|evaluate)\b/.test(s);
  const units = /\b\d+(\.\d+)?\s?(kn|kn\.?m|knm|mpa|kpa|mm|m|n)\b/.test(s);
  const labels = /(question\s*\d|\bq\d\b|\([a-d]\)|\bmarks?\b)/.test(s);
  return (verb && units) || (verb && words >= 25) || (labels && words >= 8);
}

export function route(text: string): FlowId {
  const s = text.toLowerCase().trim();
  if (assessmentLike(text)) return "ladder";
  if (/(check my (working|answer)|mark my)/.test(s)) return "check";
  if (/(what'?s due|due this week|deadline|what do i have)/.test(s)) return "due";
  if (/(who else|study with|partner|find (someone|people)|study buddy)/.test(s)) return "match";
  if (/(quiz|test me)/.test(s)) return /(material|yield|stress|strain|270)/.test(s) ? "quiz270" : "quiz275";
  if (/(workforce|outline|assessment 2)/.test(s)) return "outline";
  if (/(moment.?area|double integration|deflection|tutorial 7)/.test(s)) return "tut7";
  if (/(fixed.?end|propped|cantilever)/.test(s)) return "fem";
  if (/(meetup|friday)/.test(s)) return "meetup";
  if (/(case study|reflection|bsb105)/.test(s)) return "case";
  if (/(yield|ultimate|stress|strain|necking|young)/.test(s)) return "yield";
  if (/^(hi|hey|hello|yo|g'?day)\b/.test(s) && s.split(/\s+/).length <= 4) return "hello";
  return "oos";
}

/* flows that live in one subject, used to honour the scope chip */
const FLOW_SUBJ: Partial<Record<FlowId, SubjKey>> = {
  outline: "EGB273", tut7: "EGB275", fem: "EGB275", meetup: "EGB275", case: "BSB105",
  yield: "EGB270", quiz275: "EGB275", quiz270: "EGB270", ladder: "EGB275",
};

/* ---------- quiz banks ---------- */
const S275 = (label: string): Source => ({ subj: "EGB275", label });
const S270 = (label: string): Source => ({ subj: "EGB270", label });

const QUIZ275: Q[] = [
  {
    q: "You need the deflection at one point only, and the M/EI diagram is made of simple shapes. Which method is usually quicker?",
    options: ["Double integration", "Moment-area", "Superposition tables only", "Virtual work"],
    answer: 1,
    explain: "Moment-area gets the deflection at a point straight from areas under the M/EI diagram. Double integration gives the whole curve, so it is more work.",
    source: S275("EGB275 · Week 7 slides p.12"),
    topic: "moment-area vs double integration",
    revise: "tut7",
  },
  {
    q: "A beam of length L is fixed at both ends with a point load P at midspan. What is the fixed-end moment at each end?",
    options: ["PL/4", "PL/8", "PL/12", "PL/2"],
    answer: 1,
    explain: "For a central point load each end moment is PL/8. The wL²/12 result is the uniformly distributed load case.",
    source: S275("EGB275 · Week 5 slides p.8"),
    topic: "fixed-end moments",
    revise: "fem",
  },
  {
    q: "A propped cantilever is statically indeterminate to what degree?",
    options: ["0", "1", "2", "3"],
    answer: 1,
    explain: "There is one redundant reaction (the prop), so you need one compatibility equation on top of equilibrium.",
    source: S275("EGB275 · Tutorial 5 worked solution"),
    topic: "propped cantilevers",
    revise: "fem",
  },
];

const QUIZ270: Q[] = [
  {
    q: "On a stress-strain curve, where does permanent deformation start?",
    options: ["Proportional limit", "Yield point", "Ultimate tensile strength", "Fracture point"],
    answer: 1,
    explain: "Past the yield point the material no longer returns to its original shape when unloaded.",
    source: S270("EGB270 · Week 3 slides p.6"),
    topic: "yield point",
    revise: "yield",
  },
  {
    q: "What happens just after the ultimate tensile strength is reached?",
    options: ["The material hardens indefinitely", "Necking begins", "The material recovers elastically", "Stress keeps rising"],
    answer: 1,
    explain: "Ultimate strength is the peak of the curve. After it the cross-section starts to neck and the engineering stress falls.",
    source: S270("EGB270 · Week 3 slides p.7"),
    topic: "ultimate strength and necking",
    revise: "yield",
  },
  {
    q: "Young's modulus is the slope of which part of the curve?",
    options: ["The elastic region", "The plastic region", "The necking region", "The fracture point"],
    answer: 0,
    explain: "In the elastic region stress is proportional to strain, and the constant of proportionality is Young's modulus.",
    source: S270("EGB270 · Week 3 slides p.4"),
    topic: "Young's modulus",
    revise: "yield",
  },
];

/* ---------- matching card ---------- */
function matchFor(text: string): { people: Person[]; note: string } {
  const s = text.toLowerCase();
  const pick = (ids: string[]) => ids.map((id) => PEOPLE.find((p) => p.id === id)!).filter(Boolean);
  if (/(273|assessment 2|workforce)/.test(s))
    return { people: pick(["liam"]), note: "Liam has done EGB273 group projects before and is working on Assessment 2." };
  if (/(270|material|yield)/.test(s))
    return { people: pick(["zara", "jordan"]), note: "Both are in EGB270 and happy to compare notes." };
  if (/(105|business|case study)/.test(s))
    return { people: pick(["mei", "liam"]), note: "Both are in BSB105 and learn by talking ideas through." };
  return { people: pick(["sophie", "jordan", "zara"]), note: "All three are in EGB275 and suit how you learn." };
}

/* ---------- replies ---------- */
export type Ctx = { scope: "All" | SubjKey; done: Set<number>; joined: Set<string> };

const F = (label: string, flow: FlowId): Follow => ({ label, flow });

export function respond(flow: FlowId, text: string, ctx: Ctx): Reply {
  /* scope chip: stay inside the subject the student chose */
  const fs = FLOW_SUBJ[flow];
  if (ctx.scope !== "All" && fs && fs !== ctx.scope) {
    return {
      text: [
        `You have narrowed me to ${ctx.scope}, and what you asked about lives in ${fs} ${SUBJ[fs].n}. I would rather not guess outside your scope.`,
      ],
      card: { type: "scope", retry: { text, flow } },
      follow: [],
    };
  }

  const sg = suggest(ctx.done, ctx.joined).slice(0, 2).map((s) => F(s.prompt, s.flow));

  switch (flow) {
    case "outline":
      return {
        text: [
          "I will not write the section for you, but the Assessment 2 brief marks it on a few things, so here is a checklist that covers them. Answer each in a line or two and you have your five-bullet outline.",
        ],
        sources: [
          { subj: "EGB273", label: "EGB273 · Assessment 2 brief" },
          { subj: "EGB273", label: "EGB273 · Week 9 slides: Workforce planning" },
        ],
        card: {
          type: "checklist",
          title: "Workforce section outline",
          items: [
            "Crew size and roles for each construction stage",
            "Peak labour demand and when it happens",
            "Skills and licences needed, like crane operators and riggers",
            "How the workforce ramps up and down against the program",
            "One risk, such as turbine delivery delays, and how you would cover it",
          ],
          finish: "That is your outline. Paste it in and I will check it against the brief.",
        },
        follow: [F("Who else is working on Assessment 2?", "match"), F("What is due this week?", "due")],
      };

    case "tut7":
      return {
        text: [
          "Both methods give the same deflection, so it comes down to which is less work. Use moment-area when you need the deflection at one point and the M/EI diagram is simple shapes. Use double integration when you need the whole deflection curve.",
          "Tutorial 7 asks for a single point in questions 2 and 4, so moment-area will be quicker there.",
        ],
        sources: [S275("EGB275 · Week 7 slides p.12"), S275("EGB275 · Tutorial 5 worked solution")],
        follow: [F("Quiz me on moment-area vs double integration", "quiz275"), F("Find someone to do Tutorial 7 with", "match")],
      };

    case "fem":
      return {
        text: ["A fixed-end moment is the moment a fixed support develops because the beam cannot rotate there. The ones to know:"],
        sources: [S275("EGB275 · Week 5 slides p.8"), S275("EGB275 · Tutorial 5 worked solution")],
        card: {
          type: "formulas",
          title: "Fixed-end moments",
          rows: [
            { label: "Point load P at midspan", formula: "M = PL/8" },
            { label: "Uniform load w over the span", formula: "M = wL²/12" },
            { label: "Propped cantilever", formula: "Release prop, then compatibility" },
          ],
          note: "Each end gets the same moment for these symmetric cases.",
        },
        follow: [F("Quiz me on fixed-end moments", "quiz275"), F("What is due this week?", "due")],
      };

    case "meetup": {
      const m = matchFor("");
      return {
        text: [
          "Friday's EGB275 meetup runs 12 to 2 in Library Level 4, and 23 students are going. Two things make it worth the trip: bring one problem you got stuck on, and decide what you want out of the two hours. Tutorial 7 is due Tuesday, so that is a good one to bring.",
        ],
        card: { type: "match", people: m.people, note: "Three students going on Friday who suit how you learn." },
        follow: [F("Walk me through moment-area vs double integration", "tut7"), F("Quiz me on fixed-end moments", "quiz275")],
      };
    }

    case "case":
      return {
        text: ["Say your main idea out loud first. If it sounds clear to you, writing it up takes ten minutes. Tick these off as you cover them:"],
        sources: [{ subj: "BSB105", label: "BSB105 · Week 4 slides: Frameworks" }, { subj: "BSB105", label: "BSB105 · Case study guide" }],
        card: {
          type: "checklist",
          title: "Case study reflection plan",
          items: [
            "The one framework from week 4 you are applying",
            "Where it fits the case, with one specific example",
            "Where it does not fit, and what that tells you",
            "What you would do differently as the manager",
          ],
          finish: "That is a full plan. Write it up, then ask me to check it.",
        },
        follow: [F("Who else is working on the case study?", "match"), F("What is due this week?", "due")],
      };

    case "yield":
      return {
        text: [
          "Yield strength is where permanent deformation starts. Ultimate tensile strength is the highest stress on the curve, after which the material begins to neck. In design you stay below yield.",
        ],
        sources: [S270("EGB270 · Week 3 slides p.6")],
        follow: [F("Quiz me on stress and strain", "quiz270"), F("Find someone to study materials with", "match")],
      };

    case "quiz275":
    case "quiz270":
      return {
        text: ["Three quick ones from your own slides. Tap an answer."],
        card: {
          type: "quiz",
          title: flow === "quiz275" ? "EGB275 · Structural Analysis" : "EGB270 · Materials",
          qs: flow === "quiz275" ? QUIZ275 : QUIZ270,
        },
        follow: [],
      };

    case "match": {
      const m = matchFor(text);
      return {
        text: ["Studying with someone tends to stick better. Here is who is on the same page as you right now."],
        card: { type: "match", people: m.people, note: m.note },
        follow: [F("What is due this week?", "due")],
      };
    }

    case "ladder": {
      const propped = /(propped|cantilever|reaction|prop\b)/.test(text.toLowerCase());
      const example = {
        title: "Here is a similar one, already solved: a 4 m cantilever with a 10 kN tip load, EI = 20,000 kN·m²",
        lines: ["δ = PL³ / 3EI", "δ = 10 × 4³ / (3 × 20,000)", "δ = 0.0107 m = 10.7 mm"],
        note: propped
          ? "Same pattern for yours: find the deflection from the load, then find R so the deflection at the prop is zero."
          : "Follow the same steps on yours, with your own numbers.",
      };
      return {
        guide: true,
        text: ["Good one to practise. Let's work through it together, one step at a time. Have a go at step 1 and tick it off when you are done."],
        sources: propped ? [S275("EGB275 · Week 5 slides p.8"), S275("EGB275 · Tutorial 5 worked solution")] : [S275("EGB275 · Week 7 slides p.12")],
        card: {
          type: "ladder",
          steps: propped
            ? [
                { label: "Sketch it", task: "Draw the beam with its supports and the load. Mark every reaction you can think of, and count how many unknowns you have.", nudge: "You should find one more unknown than equilibrium can solve. That extra reaction is the redundant one." },
                { label: "Make it determinate", task: "Imagine removing the prop. Which reaction goes, and what does the beam look like now?", nudge: "Without the prop it is a plain cantilever, which you can already solve." },
                { label: "Write the compatibility equation", task: "The prop holds the beam at zero deflection. Write one equation saying the deflection from the load and the deflection from the prop reaction R add to zero at that point.", nudge: "Look at the Tutorial 5 worked solution. It uses the same compatibility idea, just with a uniform load." },
                { label: "Solve and sanity check", task: "Solve for R. Then check: is it positive, and is it a sensible fraction of the total load?", nudge: "For a load at midspan, R should be well under the full load." },
              ]
            : [
                { label: "Pull out the facts", task: "Write down what you are given, with units, and what you are asked to find.", nudge: "Circle the quantity the question asks for. Everything you write should lead there." },
                { label: "Name the method", task: "Which concept from the course connects what you have to what you need?", nudge: "Check the Week 7 slides. The method depends on whether you need one point or the whole curve." },
                { label: "Work it through", task: "Set up the equation with your own numbers and solve it. Keep the units on every line.", nudge: "If the units do not cancel to what you expect, look at the line before." },
                { label: "Sanity check", task: "Does the size of your answer make sense? Try a rough estimate to compare.", nudge: "Compare against the worked example below for order of magnitude." },
              ],
          example,
        },
        follow: [],
      };
    }

    case "check":
      return {
        text: [
          "Paste what you have so far, even if it is half done. We will go through it line by line, and I will point you to the bit worth a second look.",
        ],
        follow: [],
      };

    case "due": {
      const all = [...TODO].sort((a, b) => a.due.localeCompare(b.due));
      const open = all.filter((t) => !ctx.done.has(t.id)).length;
      return {
        mood: open ? undefined : "yay",
        text: [open ? "Here is what is due, soonest first. Tick things off as you finish them." : "Nothing is due. Nice work."],
        sources: [{ subj: "EGB273", label: "Synced from Canvas" }],
        card: {
          type: "due",
          items: all.map((t) => ({ id: t.id, t: t.t, s: t.s, subj: t.subj, ...TODO_PROMPT[t.id] })),
        },
        follow: sg,
      };
    }

    case "hello":
      return {
        text: [
          "Hi Mia. I can explain things from your course files, quiz you, or help you plan an assignment. I will not do your assessable work for you, but I will get you moving.",
        ],
        follow: sg,
      };

    case "oos":
    default:
      return {
        text: [
          `I could not find that in your course files, so I will not guess. I only answer from your ${SYNC.length} subjects and ${TOTAL_FILES} synced files.`,
        ],
        card: { type: "nosource" },
        follow: sg,
      };
  }
}

/* a pasted assignment question for the demo shortcut */
export const SAMPLE_QUESTION =
  "Question 3 (6 marks). A propped cantilever beam, 6 m long, carries a 20 kN point load at midspan. EI is constant. Determine the reaction at the prop.";
