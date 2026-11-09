import { useSyncExternalStore } from "react";
import { demoEvents } from "./demo-data";
import { dayKey } from "./pomodoro";
import { type Task } from "./board";
export type AgendaItem = { id: string; title: string; area: string; date: string; time: string; type: "event" | "deadline" | "task"; proposed?: boolean; demo?: boolean; done?: boolean };
type Changes = Record<string, Partial<AgendaItem> & { discarded?: boolean }>;
const initial: Changes = {}; let changes: Changes = initial; let loaded = false; const listeners = new Set<() => void>();
const key = "cerebro.agenda.v1";
function load() { if (loaded || typeof window === "undefined") return; loaded = true; try { changes = JSON.parse(localStorage.getItem(key) ?? "{}"); } catch {} }
export function useAgendaChanges() { return useSyncExternalStore((l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); }, () => changes, () => initial); }
export function changeEvent(id: string, value: Partial<AgendaItem> & { discarded?: boolean }) { load(); changes = { ...changes, [id]: { ...changes[id], ...value } }; try { localStorage.setItem(key, JSON.stringify(changes)); } catch {} listeners.forEach((l) => l()); }
export function agendaItems(tasks: Task[], edits: Changes, sampleDate: string): AgendaItem[] {
  const events: AgendaItem[] = demoEvents.map((e, i) => ({ id: `event-${i}`, title: e.title, area: e.area, time: e.time, date: sampleDate, type: "event", demo: true, ...edits[`event-${i}`] })).filter((e) => !edits[e.id]?.discarded);
  return [...events, ...tasks.filter((t) => t.due).map((t): AgendaItem => ({ id: t.id, title: t.title, area: t.area, date: t.due?.slice(0, 10) ?? "", time: t.due?.slice(11, 16) ?? "", type: "task", done: t.col === "done", demo: t.demo }))].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}
export function shiftDay(date: string, count: number) { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + count); return dayKey(d.getTime()); }
export const repositoryStatus = "No conectado";