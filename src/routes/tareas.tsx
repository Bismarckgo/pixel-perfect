import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { demoBoard, type BoardColumn, type BoardTask } from "@/lib/demo-data";

export const Route = createFileRoute("/tareas")({
  head: () => ({
    meta: [
      { title: "Tareas — Cerebro" },
      { name: "description", content: "Tablero Por hacer / Haciendo / Esperando / Hecho, con filtro por área." },
      { property: "og:title", content: "Tareas — Cerebro" },
      { property: "og:description", content: "Tablero Por hacer / Haciendo / Esperando / Hecho, con filtro por área." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Tareas,
});

const cols: { id: BoardColumn; label: string }[] = [
  { id: "todo", label: "Por hacer" },
  { id: "doing", label: "Haciendo" },
  { id: "waiting", label: "Esperando" },
  { id: "done", label: "Hecho" },
];
const KEY = "cerebro.board.v1";

function Tareas() {
  const [tasks, setTasks] = useState<BoardTask[]>(demoBoard);
  const [area, setArea] = useState("Todas");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setTasks(JSON.parse(raw)); } catch {}
  }, []);
  function save(next: BoardTask[]) { setTasks(next); localStorage.setItem(KEY, JSON.stringify(next)); }
  function move(id: string, dir: -1 | 1) {
    save(tasks.map((t) => {
      if (t.id !== id) return t;
      const i = cols.findIndex((c) => c.id === t.col) + dir;
      return cols[i] ? { ...t, col: cols[i].id } : t;
    }));
  }

  const areas = ["Todas", ...Array.from(new Set(tasks.map((t) => t.area)))];
  const shown = tasks.filter((t) => area === "Todas" || t.area === area);
  const doing = tasks.filter((t) => t.col === "doing").length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pt-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <div className="flex items-center gap-2"><p className="label-os">tareas</p><span className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">demo</span></div>
          <h1 className="mt-1 text-3xl font-semibold">Una cosa a la vez.</h1>
          {doing > 1 && <p className="mt-1 text-sm text-sand">Tienes {doing} cosas en Haciendo. ¿Seguro?</p>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const v = draft.trim(); if (!v) return; save([{ id: crypto.randomUUID(), title: v, area: area === "Todas" ? "Inbox" : area, col: "todo" }, ...tasks]); setDraft(""); }}
          className="ml-auto flex h-11 w-full max-w-xs items-center gap-2 rounded-full border px-4">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Nueva tarea…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </form>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {areas.map((a) => (
          <button key={a} onClick={() => setArea(a)} className={`min-h-11 shrink-0 rounded-full border px-4 text-sm ${area === a ? "bg-accent text-foreground" : "text-muted-foreground"}`}>{a}</button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cols.map((c, ci) => {
          const list = shown.filter((t) => t.col === c.id);
          return (
            <section key={c.id} className={`rounded-3xl p-4 ${c.id === "doing" ? "surface" : "border border-dashed"}`}>
              <div className="flex items-center justify-between">
                <p className="label-os">{c.label}</p>
                <span className="font-mono text-xs text-muted-foreground">{list.length}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {list.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Vacío</li>}
                {list.map((t) => (
                  <li key={t.id} className={`rounded-2xl border bg-card/50 p-3 ${c.id === "done" ? "opacity-60" : ""}`}>
                    <p className={`text-sm leading-snug ${c.id === "done" ? "line-through" : ""}`}>{t.title}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{t.area}{t.note ? ` · ${t.note}` : ""}</p>
                    <div className="mt-2 flex justify-end gap-1">
                      <button disabled={ci === 0} onClick={() => move(t.id, -1)} aria-label="Mover atrás" className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
                      <button disabled={ci === cols.length - 1} onClick={() => move(t.id, 1)} aria-label="Mover adelante" className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
