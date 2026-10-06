import { useSyncExternalStore } from "react";

export type InboxItem = { id: string; text: string; at: number };
export type CurrentTask = { area: string; icon: string; title: string; next: string };
export type State = {
  inbox: InboxItem[];
  task: CurrentTask;
  priorities: string[];
  pomodoros: number;
  duration: number;
};

const KEY = "cerebro.v1";
const initial: State = {
  inbox: [
    { id: "1", text: "Investigar YOLO", at: Date.now() - 3600_000 },
    { id: "2", text: "Ideas para portada del single", at: Date.now() - 7200_000 },
  ],
  task: {
    area: "Música",
    icon: "🎵",
    title: "Terminar mezcla de “Chicas malas”",
    next: "Revisar voces principales",
  },
  priorities: ["Música", "Cerebro", "CST"],
  pomodoros: 0,
  duration: 25,
};

let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
}

export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useCerebro() {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      l();
      return () => listeners.delete(l);
    },
    () => (load(), state),
    () => initial,
  );
}

export function captureIdea(text: string) {
  const t = text.trim();
  if (!t) return;
  setState((s) => ({ ...s, inbox: [{ id: crypto.randomUUID(), text: t, at: Date.now() }, ...s.inbox] }));
}
