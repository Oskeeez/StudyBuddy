"use client";

import { useEffect, useRef } from "react";
import { pById } from "@/lib/data";
import { StoreProvider, TITLES, useStore, type Tab } from "@/lib/store";
import { PersonSheetCard } from "./cards";
import Buddy from "./screens/Buddy";
import ChatView from "./screens/ChatView";
import Collaborate from "./screens/Collaborate";
import Discover from "./screens/Discover";
import Onboarding from "./Onboarding";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import { Avatar, Icon, Mascot } from "./ui";

function Top() {
  const { S, A } = useStore();

  if (S.chat) {
    const th = S.threads[S.chat];
    const members =
      Array.from(new Set(th.msgs.filter((m) => m.n).map((m) => m.n))).length + 2;
    return (
      <header className="top px">
        <button className="ibtn" onClick={A.closeChat} aria-label="Back">
          <Icon n="back" />
        </button>
        <Avatar name={th.name} size="s" i={th.i} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cn">{th.name}</div>
          <small className="cs">
            {th.kind === "group" ? members + " members" : th.active ? "Active now" : "Active today"}
          </small>
        </div>
      </header>
    );
  }

  if (S.tab === "home" || S.tab === "profile") return null;

  return (
    <header className="top px">
      <h1>{TITLES[S.tab]}</h1>
      {S.tab === "collaborate" && (
        <button className="ibtn" onClick={() => A.go("profile")} aria-label="Your profile">
          <Icon n="user" />
        </button>
      )}
    </header>
  );
}

const NAV: [Tab, string, string][] = [
  ["home", "Home", "home"],
  ["discover", "Connect", "discover"],
  ["collaborate", "Collaborate", "collab"],
  ["buddy", "Buddy", "spark"],
  ["profile", "Profile", "user"],
];

function Nav() {
  const { S, A } = useStore();
  const unread = Object.values(S.threads).filter((t) => t.unread).length;
  return (
    <nav className="nav" aria-label="Main">
      {NAV.map(([k, l, i]) => (
        <button
          key={k}
          onClick={() => A.go(k)}
          aria-current={S.tab === k ? "page" : undefined}
          aria-label={l}
        >
          <span className="ni">{k === "buddy" ? <Mascot fit="face" c="navmas" /> : <Icon n={i} />}</span>
          {l}
          {k === "collaborate" && unread > 0 && <span className="bd">{unread}</span>}
        </button>
      ))}
    </nav>
  );
}

function Sheet() {
  const { S, A } = useStore();
  const p = S.sheet ? pById(S.sheet) : null;
  return (
    <div className="sheet">
      {p && (
        <>
          <div className="bd2" onClick={A.closeSheet} />
          <div className="panel">
            <div className="grab" />
            <PersonSheetCard p={p} />
          </div>
        </>
      )}
    </div>
  );
}

function Shell() {
  const { S, toastMsg } = useStore();
  const mainRef = useRef<HTMLElement>(null);

  /* new screen or tab: back to the top */
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [S.tab, S.chat, S.dtab, S.ctab]);

  const buddyOn = S.tab === "buddy" && !S.chat;
  const pinTop = buddyOn || !!S.chat;
  const screens: Record<Tab, React.ReactNode> = {
    home: <Home />,
    discover: <Discover />,
    collaborate: <Collaborate />,
    buddy: null,
    profile: <Profile />,
  };

  /* connect flow first: fake Canvas sign-in, then the app */
  if (!S.entered) {
    return (
      <div className="stage">
        <div className="shell ob-shell">
          <Onboarding />
        </div>
      </div>
    );
  }

  return (
    <div className="stage">
      <div className="shell app">
        {pinTop && <Top />}
        <main className="main" ref={mainRef}>
          {!pinTop && <Top />}
          {S.chat ? <ChatView /> : screens[S.tab]}
          <div className="buddyhost" hidden={!buddyOn}>
            <Buddy active={buddyOn} />
          </div>
        </main>
        <Nav />
        <Sheet />
        <div className={`toast ${toastMsg.show ? "show" : ""}`} role="status">
          {toastMsg.text}
        </div>
      </div>
    </div>
  );
}

export default function StudyBuddyApp() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
