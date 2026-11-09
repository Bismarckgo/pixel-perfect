import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pause, Play, Square, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { areaStyle } from "@/lib/areas";
import { useTimer, tickTimer, pauseTimer, resumeTimer, cancelTimer, startTimer } from "@/lib/timer-store";
import { remaining } from "@/lib/pomodoro";
import { prepareSessionDisplay, exitSessionDisplay, sessionFeedback } from "@/lib/device-apis";
export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus Mode — Cerebro" },
      { name: "description", content: "Una sola tarea, un pomodoro y nada más." },
      { property: "og:title", content: "Focus Mode — Cerebro" },
      { property: "og:description", content: "Una sola tarea, un pomodoro y nada más." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Focus,
});

function Focus() {
 const timer = useTimer(); const s = timer.session; const navigate = useNavigate(); const [now, setNow] = useState(0); const [confirm, setConfirm] = useState(false);
 useEffect(() => { const tick = () => { setNow(Date.now()); tickTimer(); }; tick(); const id = setInterval(tick, 250); document.addEventListener("visibilitychange", tick); return () => { clearInterval(id); document.removeEventListener("visibilitychange", tick); }; }, []);
 useEffect(() => {
  if (s?.state !== "running") return;
  let lock: WakeLockSentinel | undefined; let cancelled = false;
  const acquire = async () => { if (document.visibilityState !== "visible" || !("wakeLock" in navigator)) return; try { const next = await navigator.wakeLock.request("screen"); if (cancelled) await next.release(); else lock = next; } catch {} };
  void acquire(); document.addEventListener("visibilitychange", acquire);
  return () => { cancelled = true; document.removeEventListener("visibilitychange", acquire); void lock?.release().catch(() => {}); };
 }, [s?.state]);
 useEffect(() => { if (s?.state === "complete") sessionFeedback(); }, [s?.state]);
 const exit = () => { exitSessionDisplay(); void navigate({ to: "/" }); };
 if (!s || s.state === "cancelled") return <main className="pomodoro-screen"><h1 className="text-3xl">Sin sesión activa</h1><Button className="mt-6" onClick={exit}>Volver a Hoy</Button></main>;
 const ms = now ? remaining(s, now) : s.minutes * 60000; const seconds = Math.ceil(ms / 1000); const pct = 1 - ms / (s.minutes * 60000); const a = areaStyle(s.area);
 return <main className="pomodoro-screen"><p className="flex max-w-2xl items-center gap-3 text-center text-lg"><a.icon size={24} style={{ color: a.color }} />{s.title}</p><div className="pomodoro-dial"><svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true"><circle cx="200" cy="200" r="185" fill="none" stroke="var(--border)" strokeWidth="5" /><circle cx="200" cy="200" r="185" fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" strokeDasharray="1162.39" strokeDashoffset={1162.39 * (1 - pct)} /></svg><div className="relative text-center">{s.state === "complete" ? <><Check className="mx-auto mb-4 h-12 w-12 text-primary" /><h1 className="text-3xl font-semibold">Sesión completa</h1></> : <><h1 className="pomodoro-time">{String(Math.floor(seconds / 60)).padStart(2,"0")}:{String(seconds % 60).padStart(2,"0")}</h1><p className="mt-4 text-muted-foreground">{s.state === "paused" ? "En pausa" : "En foco"}</p></>}</div></div><div className="flex flex-wrap justify-center gap-4">{s.state === "complete" ? <><Button onClick={() => { if (startTimer(s.taskId, s.minutes)) prepareSessionDisplay(); }}>Otra sesión</Button><Button variant="outline" onClick={exit}>Volver a Hoy</Button></> : <><Button variant="outline" onClick={s.state === "paused" ? resumeTimer : pauseTimer}>{s.state === "paused" ? <><Play />Continuar</> : <><Pause />Pausar</>}</Button><Button variant="outline" onClick={() => setConfirm(true)}><Square />Terminar</Button></>}</div>{confirm && <div className="sheet-backdrop"><section className="tablet-sheet" role="dialog" aria-modal="true" aria-label="Terminar sesión"><h2 className="text-2xl font-semibold">¿Terminar esta sesión?</h2><div className="mt-6 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setConfirm(false)}>Seguir en foco</Button><Button onClick={() => { cancelTimer(); exit(); }}>Terminar sesión</Button></div></section></div>}</main>;
}
