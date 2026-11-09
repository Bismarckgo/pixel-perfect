export type Session = { id: string; taskId: string; title: string; area: string; minutes: 25 | 50; start: number; end: number; pausedRemaining?: number; state: "running" | "paused" | "complete" | "cancelled" };
export type PomodoroRecord = { id: string; text: string; at: number; verified: true; day: string };
export type TimerData = { session: Session | null; history: PomodoroRecord[]; focusId?: string; minutes: 25 | 50 };
export const emptyTimer: TimerData = { session: null, history: [], minutes: 25 };
export function dayKey(at: number) { const d = new Date(at); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
export function remaining(s: Session, now: number) { return s.state === "paused" ? s.pausedRemaining ?? 0 : s.state === "running" ? Math.max(0, s.end - now) : 0; }
export function makeSession(task: { id: string; title: string; area: string }, minutes: 25 | 50, now: number, id: string): Session { return { id, taskId: task.id, title: task.title, area: task.area, minutes, start: now, end: now + minutes * 60_000, state: "running" }; }
export function pauseSession(s: Session, now: number): Session { return s.state === "running" ? { ...s, state: "paused", pausedRemaining: remaining(s, now) } : s; }
export function resumeSession(s: Session, now: number): Session { return s.state === "paused" ? { ...s, state: "running", end: now + (s.pausedRemaining ?? 0), pausedRemaining: undefined } : s; }
export function finishTimer(data: TimerData, now: number): TimerData {
  const s = data.session;
  if (!s || s.state !== "running" || remaining(s, now) > 0) return data;
  const record: PomodoroRecord = { id: s.id, text: `Pomodoro completado · ${s.title}`, at: s.end, day: dayKey(s.end), verified: true };
  return { ...data, session: { ...s, state: "complete" }, history: data.history.some((r) => r.id === s.id) ? data.history : [record, ...data.history] };
}