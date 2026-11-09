import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X, ArrowUp, Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { captureIdea, removeIdea } from "@/lib/cerebro-store";
import { getTasks } from "@/lib/board";
import { getTimer, startTimer, undoTimer } from "@/lib/timer-store";
import { prepareSessionDisplay, exitSessionDisplay } from "@/lib/device-apis";
const listeners = new Set<() => void>();
export function toggleDonna() { listeners.forEach((l) => l()); }
/** Voice adapter refuses remote recognition; a future on-device adapter can implement this contract. */
export const voiceInput = { mode: "text" as const, start: (focus: () => void) => focus() };
export function Donna() {
 const [open, setOpen] = useState(false); const [text, setText] = useState(""); const [subtitle, setSubtitle] = useState(""); const [receipt, setReceipt] = useState<{ id: string; type: "idea" | "timer" } | null>(null); const input = useRef<HTMLInputElement>(null); const navigate = useNavigate();
 useEffect(() => { const l = () => { setOpen((o) => !o); setSubtitle(""); }; listeners.add(l); return () => { listeners.delete(l); }; }, []);
 useEffect(() => { if (open) voiceInput.start(() => input.current?.focus()); }, [open]);
 function send() {
  const value = text.trim(); if (!value) return;
  setSubtitle(value); setText(""); setOpen(false);
  if (/pomodoro/i.test(value)) {
   const minutes = /50/.test(value) ? 50 : 25; const timer = getTimer(); const task = getTasks().find((t) => t.id === timer.focusId && ["todo", "doing"].includes(t.col)) ?? getTasks().find((t) => ["todo", "doing"].includes(t.col));
   if (!task || !startTimer(task.id, minutes)) return;
   prepareSessionDisplay(); const session = getTimer().session; if (session) setReceipt({ id: session.id, type: "timer" }); void navigate({ to: "/focus" });
  } else if (/^guarda (esta )?idea[: ]/i.test(value)) { const id = captureIdea(value.replace(/^guarda (esta )?idea[: ]*/i, "")); if (id) setReceipt({ id, type: "idea" }); }
 }
 return <>{open && <form className="donna-input" onSubmit={(e) => { e.preventDefault(); send(); }}><input ref={input} aria-label="Escribe a Donna" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe a Donna…" /><Button type="submit" aria-label="Enviar a Donna"><ArrowUp /></Button><Button variant="ghost" size="icon" aria-label="Cerrar Donna" onClick={() => setOpen(false)}><X /></Button></form>}{subtitle && !open && <p className="donna-subtitle">{subtitle}</p>}{receipt && <div className="donna-receipt" role="status"><Check size={18} /><span>{receipt.type === "idea" ? "Idea guardada" : "Pomodoro iniciado"}</span><Button variant="ghost" onClick={() => { if (receipt.type === "idea") removeIdea(receipt.id); else { undoTimer(receipt.id); exitSessionDisplay(); void navigate({ to: "/" }); } setReceipt(null); }}><Undo2 />Deshacer</Button><Button variant="ghost" size="icon" aria-label="Cerrar aviso" onClick={() => setReceipt(null)}><X /></Button></div>}</>;
}
