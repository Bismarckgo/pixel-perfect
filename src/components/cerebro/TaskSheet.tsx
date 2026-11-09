import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moveTask, type Task, type Col } from "@/lib/board";
import { areaStyle } from "@/lib/areas";
export function TaskSheet({ task, close }: { task: Task; close: () => void }) {
  const a = areaStyle(task.area);
  return <div className="sheet-backdrop" onClick={close}><section className="tablet-sheet" role="dialog" aria-modal="true" aria-label="Asignar tarea" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{task.title}</h2><Button variant="ghost" size="icon" aria-label="Cerrar" onClick={close}><X /></Button></div><p className="mt-3 flex items-center gap-2 text-muted-foreground"><a.icon style={{ color: a.color }} size={20} />{task.area}</p><div className="mt-6 grid gap-3">{([["todo", "Por hacer"], ["doing", "En proceso"], ["done", "Completadas"]] as [Col, string][]).map(([col, name]) => <Button key={col} variant={task.col === col ? "default" : "outline"} onClick={() => { moveTask(task.id, col); close(); }}>{name}</Button>)}</div></section></div>;
}