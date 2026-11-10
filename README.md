# Study Buddy

A mobile-first web app prototype for QUT students: find study partners, ask questions anonymously, and (coming soon) chat with Buddy, a course-aware AI tutor.

This is a prototype with fictional demo content. It is not connected to real student accounts or Canvas.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## What is in it

- **Home**: Buddy tips, top match, pinned question, to-do list with next-step nudges, this week's meetups
- **Connect**: study partner suggestions (with a "both said yes" reveal), weekly meetup calendar, club events
- **Collaborate**: anonymous Q&A board with similar-question search, direct messages, group chats
- **Buddy**: scripted course-aware chat with interactive cards (quiz with review, checklists, formulas, live to-do list, study matches with a "why you two fit" line). Every answer has source chips you can tap to see the lecture content behind it. Pasting an assignment question starts guided practice: steps for the student to try and tick off, a nudge if they are stuck, and a similar worked example
- **Profile**: learning preferences and privacy toggles

The layout is a phone-shaped shell that fills the screen on mobile and sits centred on desktop. The theme is light only.

## Structure

```
app/                  Next.js App Router (layout, global CSS, single page)
components/
  StudyBuddyApp.tsx   Shell: header, tab bar, Buddy pop-up, bottom sheet, toast
  screens/            Home, Discover, Collaborate, ChatView, Buddy, Profile
  cards.tsx           Shared cards (meetup rows, people, agenda, board posts)
  TipCard.tsx         Buddy tip card
lib/
  store.tsx           All app state and actions (React context)
  data.ts             Fictional demo data
  dates.ts            Date helpers (demo is pinned to 7 Nov 2026)
  search.ts           Similar-question matching
```

## Deploy (Netlify)

Import the repo in Netlify. It detects Next.js and uses `npm run build`. Every push to `main` redeploys.

When the AI is added, keep the Claude API key in Netlify's environment variables. Never commit it. `.env*` files are git-ignored.

## Roadmap

1. Fake Canvas-style sign-in and course sync animation
2. Buddy chat with scripted replies, then live Claude calls over a small bundled course pack
3. Anti-cheat behaviour: hints first, Socratic mode when an assignment question is pasted
4. AI-written "why you two fit" blurbs for study matching
