import { useSyncExternalStore } from "react";
import { getTasks, moveTask } from "./board";
import { emptyTimer, finishTimer, makeSession, pauseSession, resumeSession, type TimerData } from "./pomodoro";

const key = "cerebro.timer.v1";
let data: TimerData = emptyTimer;
let loaded = false;
const listeners = new Set<() => void>();
function load() { if (loaded || typeof window === "undefined") return; loaded = true; try { const raw = localStorage.getItem(key); if (raw) { const value = JSON.parse(raw); if (Array.isArray(value.history) && [25, 50].includes(value.minutes)) data = value; } } catch {} }
export function updateTimer(fn: (d: TimerData) => TimerData) { load(); const next = fn(data); if (next === data) return; data = next; try { localStorage.setItem(key, JSON.stringify(data)); } catch {} listeners.forEach((l) => l()); }
export function useTimer() { return useSyncExternalStore((l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); }, () => data, () => emptyTimer); }
export function getTimer() { load(); return data; }
export function tickTimer(now = Date.now()) { updateTimer((d) => finishTimer(d, now)); }
export function startTimer(taskId: string, minutes: 25 | 50) {
  const task = getTasks().find((t) => t.id === taskId && t.col !== "done" && t.col !== "unassigned");
  if (!task) return false;
  const current = getTimer().session;
  if (current?.state === "running" || current?.state === "paused") return true;
  moveTask(task.id, "doing");
  updateTimer((d) => ({ ...d, focusId: task.id, minutes, session: makeSession(task, minutes, Date.now(), crypto.randomUUID()) }));
  return true;
}
export function pauseTimer() { tickTimer(); updateTimer((d) => d.session ? { ...d, session: pauseSession(d.session, Date.now()) } : d); }
export function resumeTimer() { updateTimer((d) => d.session ? { ...d, session: resumeSession(d.session, Date.now()) } : d); }
export function cancelTimer() { updateTimer((d) => d.session ? { ...d, session: { ...d.session, state: "cancelled" } } : d); }
export function undoTimer(id: string) { updateTimer((d) => d.session?.id === id && ["running", "paused"].includes(d.session.state) ? { ...d, session: { ...d.session, state: "cancelled" } } : d); }