import { useSyncExternalStore } from "react";
import { demoBoard, type BoardTask } from "@/lib/demo-data";

/** Fuente única de tareas: Hoy y el Kanban leen y escriben aquí. */
export type Col = "todo" | "doing" | "done";
export type Task = Omit<BoardTask, "col"> & { col: Col; prev?: Col | undefined };

const KEY = "cerebro.board.v1";
const normalize = (list: BoardTask[]): Task[] =>
  list.map((t) => ({ ...t, col: t.col === "waiting" ? "todo" : (t.col as Col) }));
const initial = normalize(demoBoard);

let tasks: Task[] = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(KEY); if (raw) tasks = normalize(JSON.parse(raw)); } catch {}
}

export function setTasks(fn: (t: Task[]) => Task[]) {
  load();
  tasks = fn(tasks);
  localStorage.setItem(KEY, JSON.stringify(tasks));
  listeners.forEach((l) => l());
}

export function useTasks() {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => (load(), tasks),
    () => initial,
  );
}

/** Completar desde Hoy = mover a Completadas en el Kanban. Desmarcar la devuelve a su columna. */
export function toggleDone(id: string) {
  setTasks((all) => all.map((t) =>
    t.id !== id ? t : t.col === "done" ? { ...t, col: t.prev ?? "todo", prev: undefined } : { ...t, prev: t.col, col: "done" },
  ));
}
