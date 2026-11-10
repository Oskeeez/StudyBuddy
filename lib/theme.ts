"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeId = "current" | "opt1" | "opt2";

export const THEMES: { id: ThemeId; label: string; note: string; bar: string; swatch: string[] }[] = [
  { id: "current", label: "Current", note: "The blue look you have now.", bar: "#F1F6FF", swatch: ["#F1F6FF", "#0F2D5E", "#1F62D6"] },
  { id: "opt1", label: "Option 1", note: "Sticky note classic: soft blue with mint and lilac.", bar: "#E3EEFF", swatch: ["#E3EEFF", "#0F2D5E", "#FFD84D"] },
  { id: "opt2", label: "Option 2", note: "Warm paper: cream with a yellow accent.", bar: "#FBF7EE", swatch: ["#FBF7EE", "#0F2D5E", "#F2B134"] },
];

const KEY = "studybuddy-theme";

export function applyTheme(id: ThemeId) {
  const el = document.documentElement;
  if (id === "current") el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", id);
  const bar = THEMES.find((t) => t.id === id)?.bar;
  if (bar) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bar);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>("current");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as ThemeId | null;
      if (saved && THEMES.some((t) => t.id === saved)) {
        setThemeState(saved);
        applyTheme(saved);
      }
    } catch {}
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    applyTheme(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {}
  }, []);

  return { theme, setTheme };
}
