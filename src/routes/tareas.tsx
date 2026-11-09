import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useTasks, setTasks, type Col, type Task } from "@/lib/board";
import { Button } from "@/components/ui/button";
import { TaskSheet } from "@/components/cerebro/TaskSheet";
import { areaStyle } from "@/lib/areas";

export const Route = createFileRoute("/tareas")({
  head: () => ({
    meta: [
      { title: "Tareas — Cerebro" },
      { name: "description", content: "Tablero Por hacer / En proceso / Completadas, con filtro por área." },
      { property: "og:title", content: "Tareas — Cerebro" },
      { property: "og:description", content: "Tablero Por hacer / En proceso / Completadas, con filtro por área." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Tareas,
});

const cols: { id: Col; label: string }[] = [{ id: "unassigned", label: "Caja de tareas" }, { id: "todo", label: "Por hacer" }, { id: "doing", label: "En proceso" }, { id: "done", label: "Completadas" }];
function Tareas() {
  const tasks = useTasks(); const [area, setArea] = useState("Todas"); const [draft, setDraft] = useState(""); const [newArea, setNewArea] = useState("Personal"); const [due, setDue] = useState(""); const [selected, setSelected] = useState<Task | null>(null);
  const areas = ["Música", "CST", "W Agency Ads", "Cerebro", "Personal", "Sistema", "Fotografía analógica"];
  return <main className="tablet-page"><h1 className="text-3xl font-semibold">Tareas</h1>
    <form className="mt-6 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setTasks((all) => [{ id: crypto.randomUUID(), title: draft.trim(), area: newArea, col: "unassigned", due: due || undefined, demo: false }, ...all]); setDraft(""); setDue(""); }}>
    <label className="min-w-0 flex-1">Nueva tarea<input aria-label="Nueva tarea" className="tablet-input mt-2 w-full" placeholder="Título de la tarea" value={draft} onChange={(e) => setDraft(e.target.value)} required /></label>
    <label>Área<select aria-label="Área de la tarea" className="tablet-input mt-2 block" value={newArea} onChange={(e) => setNewArea(e.target.value)}>{areas.map((a) => <option key={a}>{a}</option>)}</select></label>
    <label>Fecha y hora<input aria-label="Fecha y hora" type="datetime-local" className="tablet-input mt-2 block" value={due} onChange={(e) => setDue(e.target.value)} /></label><Button type="submit"><Plus />Crear</Button></form>
    <div className="mt-6"><select aria-label="Filtrar área" className="tablet-input" value={area} onChange={(e) => setArea(e.target.value)}>{["Todas", ...areas].map((a) => <option key={a}>{a}</option>)}</select></div>
    <div className="task-board mt-6">{cols.map((c) => <section key={c.id} className={c.id === "unassigned" ? "task-inbox" : ""}><h2 className="label-os">{c.label} · {tasks.filter((t) => t.col === c.id && (area === "Todas" || t.area === area)).length}</h2><ul className="mt-4 space-y-3">{tasks.filter((t) => t.col === c.id && (area === "Todas" || t.area === area)).map((t) => { const a = areaStyle(t.area); return <li key={t.id}><Button variant="ghost" className="task-card" onClick={() => setSelected(t)}><span className={`block whitespace-normal ${t.col === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</span><span className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground"><a.icon size={18} style={{ color: a.color }} />{t.area}{t.demo ? " · Demo" : ""}</span>{t.due && <span className="mt-2 block text-[13px] text-muted-foreground">{t.due.replace("T", " · ")}</span>}</Button></li>; })}</ul></section>)}</div>{selected && <TaskSheet task={selected} close={() => setSelected(null)} />}
  </main>;
}
