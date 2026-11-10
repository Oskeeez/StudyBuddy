"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  PEOPLE,
  POSTS,
  THREADS,
  TIPS,
  TODO,
  type Person,
  type Post,
  type SubjKey,
  type Thread,
} from "./data";
import { D, addDays, dkey, mondayOf, parseK } from "./dates";

export type Tab = "home" | "discover" | "collaborate" | "buddy" | "profile";

export const TITLES: Record<string, string> = {
  discover: "Find your people",
  collaborate: "Collaborate",
  buddy: "Buddy",
  profile: "Profile",
};

export type State = {
  entered: boolean;
  tab: Tab;
  dtab: "people" | "sessions";
  ctab: "board" | "messages" | "groups";
  filter: string;
  chat: string | null;
  sheet: string | null;
  wk: Date;
  day: string;
  tip: number;
  tipOpen: string | null;
  chatTips: boolean;
  guide: boolean;
  q: string;
  ms: string;
  conn: boolean;
  rsvp: Set<string>;
  connected: Set<string>;
  passed: Set<string>;
  joined: Set<string>;
  done: Set<number>;
  helpful: Set<number>;
  open: Set<number>;
  prefs: Set<string>;
  priv: { buddy: boolean; visible: boolean };
  posts: Post[];
  threads: Record<string, Thread>;
};

const initial = (): State => ({
  entered: false,
  tab: "home",
  dtab: "people",
  ctab: "board",
  filter: "All",
  chat: null,
  sheet: null,
  wk: mondayOf(D(2026, 11, 13)),
  day: "2026-11-13",
  tip: 0,
  tipOpen: null,
  chatTips: false,
  guide: false,
  q: "",
  ms: "",
  conn: false,
  rsvp: new Set(),
  connected: new Set(),
  passed: new Set(),
  joined: new Set(),
  done: new Set(),
  helpful: new Set(),
  open: new Set(),
  prefs: new Set(["Visual", "Afternoons", "On campus", "Small groups"]),
  priv: { buddy: false, visible: true },
  posts: POSTS.slice(),
  threads: JSON.parse(JSON.stringify(THREADS)) as Record<string, Thread>,
});

function toggle<T>(set: Set<T>, v: T): Set<T> {
  const n = new Set(set);
  if (n.has(v)) n.delete(v);
  else n.add(v);
  return n;
}
function add<T>(set: Set<T>, v: T): Set<T> {
  const n = new Set(set);
  n.add(v);
  return n;
}

/* people shown in the Connect list */
export const pool = (S: State): Person[] => [
  ...PEOPLE.filter((p) => !S.passed.has(p.id) && !S.connected.has(p.id)),
];

export type Actions = ReturnType<typeof makeActions>;

function makeActions(
  S: State,
  setS: React.Dispatch<React.SetStateAction<State>>,
  toast: (m: string) => void,
) {
  const go = (tab: Tab, patch: Partial<State> = {}) => {
    setS((s) => ({ ...s, ...patch, tab, chat: null }));
    try {
      history.replaceState(null, "", "#" + tab);
    } catch {
      /* ignore */
    }
  };

  const A = {
    go,
    enter() {
      setS((s) => ({ ...s, entered: true, tab: "home", chat: null }));
      try {
        history.replaceState(null, "", "#home");
      } catch {
        /* ignore */
      }
    },
    signOut() {
      /* back to the connect flow, with the demo reset so it can be replayed */
      setS(() => initial());
      try {
        history.replaceState(null, "", location.pathname);
      } catch {
        /* ignore */
      }
    },
    openSessions() {
      go("discover", {
        dtab: "sessions",
        day: "2026-11-13",
        wk: mondayOf(D(2026, 11, 13)),
      });
    },
    openGroups() {
      go("collaborate", { ctab: "groups" });
    },
    bell() {
      toast("You have 2 new messages");
    },
    todo(id: number) {
      setS((s) => ({ ...s, done: toggle(s.done, id) }));
    },
    nudge(id: number) {
      const x = TODO.find((t) => t.id === id)!;
      const [tab, , arg] = x.to;
      if (tab === "discover") {
        go("discover", { dtab: "sessions", day: arg, wk: mondayOf(parseK(arg)) });
      } else {
        go("collaborate", { filter: arg, ctab: "board" });
      }
    },
    peek(id: string) {
      setS((s) => ({ ...s, sheet: id }));
    },
    closeSheet() {
      setS((s) => ({ ...s, sheet: null }));
    },
    guide() {
      setS((s) => ({ ...s, guide: !s.guide }));
    },
    reqs() {
      toast("No requests right now");
    },
    dtab(v: State["dtab"]) {
      setS((s) => ({ ...s, dtab: v }));
    },
    filter(v: string) {
      setS((s) => ({ ...s, filter: v }));
    },
    join(key: string) {
      const adding = !S.joined.has(key);
      setS((s) => ({ ...s, joined: toggle(s.joined, key) }));
      if (adding) toast("You are going. Added to your calendar.");
    },
    day(v: string) {
      setS((s) => ({ ...s, day: v }));
    },
    wk(n: number) {
      setS((s) => {
        const wk = addDays(s.wk, n * 7);
        return { ...s, wk, day: dkey(wk) };
      });
    },
    rsvp(id: string) {
      const adding = !S.rsvp.has(id);
      setS((s) => ({ ...s, rsvp: toggle(s.rsvp, id) }));
      if (adding) toast("You are going. Buddy will remind you.");
    },
    tipNext() {
      setS((s) => ({ ...s, tip: (s.tip + 1) % TIPS.length, tipOpen: null }));
    },
    tipGo() {
      const k = TIPS[S.tip].k;
      if (k === "club") A.openSessions();
      else setS((s) => ({ ...s, tipOpen: s.tipOpen === k ? null : k }));
    },
    saySend(m: string) {
      setS((s) => ({
        ...s,
        tipOpen: null,
        threads: {
          ...s.threads,
          crew: {
            name: "EGB275 Friday meetup crew",
            i: 4,
            kind: "group",
            last: "You: " + m,
            time: "now",
            msgs: [{ t: m, me: 1 }],
          },
        },
      }));
      toast("Sent. Find the chat under Collaborate > Groups.");
    },
    ctips() {
      setS((s) => ({ ...s, chatTips: !s.chatTips }));
    },
    pass(id: string) {
      setS((s) => ({ ...s, sheet: null, passed: add(s.passed, id) }));
    },
    connect(id: string) {
      if (id === "priya") {
        setS((s) => ({
          ...s,
          sheet: null,
          conn: true,
          threads: {
            ...s.threads,
            priya: {
              name: "Priya Sharma",
              i: 0,
              kind: "dm",
              last: "You are connected. Say hi!",
              time: "now",
              unread: true,
              msgs: [],
            },
          },
        }));
        toast("You are connected with Priya. Say hi!");
      } else {
        setS((s) => ({ ...s, sheet: null, connected: add(s.connected, id) }));
        toast("Request sent to " + PEOPLE.find((p) => p.id === id)!.name.split(" ")[0]);
      }
    },
    resetP() {
      setS((s) => ({ ...s, passed: new Set(), connected: new Set() }));
    },
    newgroup() {
      toast("Group creation is coming in the next build");
    },
    ctab(v: State["ctab"]) {
      setS((s) => ({ ...s, ctab: v, ms: "" }));
    },
    setQ(v: string) {
      setS((s) => ({ ...s, q: v }));
    },
    setMs(v: string) {
      setS((s) => ({ ...s, ms: v }));
    },
    post(text: string) {
      const q = text.trim();
      if (!q || S.filter === "All") return false;
      setS((s) => ({
        ...s,
        q: "",
        posts: [
          { id: Date.now(), subj: s.filter as SubjKey, time: "now", q, helpful: 0, cm: [], tutor: null },
          ...s.posts,
        ],
      }));
      toast("Posted");
      return true;
    },
    helpful(id: number) {
      setS((s) => ({ ...s, helpful: toggle(s.helpful, id) }));
    },
    open(id: number) {
      setS((s) => ({ ...s, open: toggle(s.open, id) }));
    },
    reply(id: number, t: string) {
      setS((s) => ({
        ...s,
        posts: s.posts.map((p) => (p.id === id ? { ...p, cm: [...p.cm, { t }] } : p)),
      }));
    },
    chat(k: string) {
      setS((s) => ({
        ...s,
        chat: k,
        threads: { ...s.threads, [k]: { ...s.threads[k], unread: false } },
      }));
    },
    closeChat() {
      setS((s) => ({ ...s, chat: null }));
    },
    sendChat(text: string) {
      const key = S.chat;
      if (!key) return;
      setS((s) => {
        const th = s.threads[key];
        return {
          ...s,
          threads: {
            ...s.threads,
            [key]: { ...th, msgs: [...th.msgs, { t: text, me: 1 }], last: "You: " + text, time: "now" },
          },
        };
      });
      setTimeout(() => {
        setS((s) => {
          const th = s.threads[key];
          const group = th.kind === "group";
          const r = {
            t: group ? "Sounds good to me!" : "Sounds good! See you there.",
            n: group ? "Sophie" : undefined,
          };
          return {
            ...s,
            threads: { ...s.threads, [key]: { ...th, msgs: [...th.msgs, r], last: r.t } },
          };
        });
      }, 1100);
    },
    notify() {
      toast("Done. We will let you know.");
    },
    pref(v: string) {
      setS((s) => ({ ...s, prefs: toggle(s.prefs, v) }));
    },
    priv(k: "buddy" | "visible") {
      setS((s) => ({ ...s, priv: { ...s.priv, [k]: !s.priv[k] } }));
    },
    homeSearch(q: string) {
      go("collaborate", { q: q.trim(), ctab: "board", filter: "All" });
    },
  };
  return A;
}

type Ctx = {
  S: State;
  A: Actions;
  toastMsg: { text: string; show: boolean };
};
const StoreCtx = createContext<Ctx | null>(null);
export const useStore = () => useContext(StoreCtx)!;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [S, setS] = useState<State>(initial);
  const [toastMsg, setToastMsg] = useState({ text: "", show: false });
  const toastT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toast = useCallback((text: string) => {
    setToastMsg({ text, show: true });
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToastMsg((t) => ({ ...t, show: false })), 2200);
  }, []);

  /* open the tab named in the URL hash, and follow hash changes */
  useEffect(() => {
    const apply = () => {
      const h = location.hash.slice(1);
      /* a tab in the URL (e.g. #collaborate) skips the connect flow, handy for deep links */
      if (h in TITLES || h === "home") {
        setS((s) =>
          h !== s.tab || s.chat || !s.entered
            ? { ...s, tab: h as Tab, chat: null, entered: true }
            : s,
        );
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const A = makeActions(S, setS, toast);
  return <StoreCtx.Provider value={{ S, A, toastMsg }}>{children}</StoreCtx.Provider>;
}
