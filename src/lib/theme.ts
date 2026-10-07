import { useEffect, useState } from "react";

/** Día de Bismarck: claro desde que despierta hasta la noche. Ajustable. */
export const THEME_HOURS = { wake: 16, night: 22 };

export type Theme = "light" | "dark";

export function themeForHour(h: number): Theme {
  return h >= THEME_HOURS.wake && h < THEME_HOURS.night ? "light" : "dark";
}

/** Script inline para evitar parpadeo antes de hidratar. */
export const themeInitScript = `(function(){try{var o=localStorage.getItem('cerebro.theme');var h=new Date().getHours();var t=o==='light'||o==='dark'?o:(h>=${THEME_HOURS.wake}&&h<${THEME_HOURS.night}?'light':'dark');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

export function useTheme() {
  const [override, setOverride] = useState<Theme | "auto">("auto");
  const [auto, setAuto] = useState<Theme>("dark");

  useEffect(() => {
    const o = localStorage.getItem("cerebro.theme");
    if (o === "light" || o === "dark") setOverride(o);
    const tick = () => setAuto(themeForHour(new Date().getHours()));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  const theme = override === "auto" ? auto : override;

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  function cycle() {
    const next = override === "auto" ? (theme === "light" ? "dark" : "light") : override === "light" ? "dark" : "auto";
    setOverride(next);
    if (next === "auto") localStorage.removeItem("cerebro.theme");
    else localStorage.setItem("cerebro.theme", next);
  }

  return { theme, mode: override, cycle };
}
