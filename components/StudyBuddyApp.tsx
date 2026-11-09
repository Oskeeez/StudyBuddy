"use client";

import { useEffect, useRef } from "react";
import { pById } from "@/lib/data";
import { StoreProvider, TITLES, useStore, type AlertKind, type Tab } from "@/lib/store";
import { PersonSheetCard } from "./cards";
import Buddy from "./screens/Buddy";
import ChatView from "./screens/ChatView";
import Collaborate from "./screens/Collaborate";
import Discover from "./screens/Discover";
import Onboarding from "./Onboarding";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import { Avatar, Icon } from "./ui";

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

  if (S.tab === "home") {
    return (
      <header className="top px">
        <span className="sp" />
        <button className="ibtn" onClick={A.bell} aria-label="Notifications">
          <Icon n="bell" />
          <i className="dot" />
        </button>
      </header>
    );
  }

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
  ["buddy", "Buddy", "buddy"],
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
          <Icon n={i} />
          {l}
          {k === "collaborate" && unread > 0 && <span className="bd">{unread}</span>}
        </button>
      ))}
    </nav>
  );
}

/* Buddy's pop-up at the top: keeps its last content while it slides away */
function AlertPop() {
  const { S, A } = useStore();
  const last = useRef<AlertKind>(null);
  if (S.alert) last.current = S.alert;
  const kind = last.current;

  return (
    <div className={`alert ${S.alert ? "show" : ""}`} role="alert">
      {kind === "offer" && (
        <>
          <div className="h">
            <div className="bot">
              <Icon n="buddy" />
            </div>
            <b>You have a possible study partner</b>
          </div>
          <p>
            A Year 2 civil engineering student in EGB270 and EGB275 who also learns visually. Would you like us
            to suggest your profile to them? They only see you if they say yes too.
          </p>
          <div className="acts">
            <button className="btn ghost" onClick={A.sNo}>
              No thanks
            </button>
            <button className="btn" onClick={A.sYes}>
              Yes, suggest me
            </button>
          </div>
        </>
      )}
      {kind === "mutual" && (
        <>
          <div className="h">
            <div className="bot">
              <Icon n="spark" />
            </div>
            <b>Priya said yes too</b>
          </div>
          <p>
            You both agreed to be suggested. Have a look at each other’s profiles and decide if you want to
            connect.
          </p>
          <div className="acts">
            <button className="btn ghost" onClick={A.sLater}>
              Later
            </button>
            <button className="btn" onClick={A.sView}>
              View profile
            </button>
          </div>
        </>
      )}
    </div>
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
        <div className="shell">
          <Onboarding />
        </div>
      </div>
    );
  }

  return (
    <div className="stage">
      <div className="shell app">
        <Top />
        <main className="main" ref={mainRef}>
          {S.chat ? <ChatView /> : screens[S.tab]}
          <div className="buddyhost" hidden={!buddyOn}>
            <Buddy active={buddyOn} />
          </div>
        </main>
        <Nav />
        <AlertPop />
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
