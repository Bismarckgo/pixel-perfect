import { useEffect, useState } from "react";
import { X, ArrowUp, Check, Undo2 } from "lucide-react";
import { captureIdea, removeIdea, useCerebro } from "@/lib/cerebro-store";

const suggestions = ["¿Qué tengo pendiente?", "Guarda esta idea: portada con fotos analógicas", "Ayúdame a definir hitos de CST"];

type Msg = { from: "me" | "donna"; text: string; undoId?: string | undefined; undone?: boolean };

const listeners = new Set<() => void>();
export function toggleDonna() { listeners.forEach((l) => l()); }

export function Donna() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const s = useCerebro();

  useEffect(() => {
    const l = () => setOpen((o) => !o);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  function send(t: string) {
    const v = t.trim();
    if (!v) return;
    let reply: Msg;
    if (/pendiente|qué tengo/i.test(v)) {
      reply = { from: "donna", text: `Ahora mismo: ${s.task.title}. Tienes ${s.inbox.length} cosas en el Inbox. Lo demás puede esperar.` };
    } else if (/hitos|cst/i.test(v)) {
      reply = { from: "donna", text: "Para CST todavía no hay hitos definidos. Dime cuál sería el primer entregable visible y lo anoto. No voy a inventarlo por ti." };
    } else {
      const clean = v.replace(/^guarda esta idea:\s*/i, "");
      const id = captureIdea(clean);
      reply = { from: "donna", text: `Guardado en tu Inbox: “${clean}”.`, undoId: id };
    }
    setMsgs((m) => [...m, { from: "me", text: v }, reply]);
    setText("");
  }

  function undo(i: number) {
    const m = msgs[i];
    if (!m?.undoId) return;
    removeIdea(m.undoId);
    setMsgs((all) => all.map((x, j) => (j === i ? { ...x, undone: true } : x)));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-28 z-40 mx-auto flex h-[30rem] w-[min(34rem,calc(100vw-2rem))] flex-col rounded-3xl glass bg-glass-strong p-5 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-orb" />
          <div>
            <p className="font-semibold">Donna</p>
            <p className="label-os">lista</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-foreground" aria-label="Cerrar">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
        {msgs.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Te escucho. ¿Qué necesitas?</p>
            {suggestions.map((q) => (
              <button key={q} onClick={() => send(q)} className="block min-h-11 w-full rounded-2xl border px-4 py-2 text-left text-sm hover:bg-accent">{q}</button>
            ))}
          </div>
        ) : (
          msgs.map((m, i) =>
            m.from === "me" ? (
              <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl bg-secondary px-4 py-2 text-sm">{m.text}</div>
            ) : (
              <div key={i} className="max-w-[92%] text-sm leading-relaxed">
                <p>{m.undone ? "Deshecho. Lo quité del Inbox." : m.text}</p>
                {m.undoId && !m.undone && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-success"><Check className="h-3.5 w-3.5" /> verificado en Inbox</span>
                    <button onClick={() => undo(i)} className="flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs"><Undo2 className="h-3.5 w-3.5" /> Deshacer</button>
                  </div>
                )}
              </div>
            ),
          )
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="mt-3 flex items-center gap-2 rounded-2xl border bg-background/40 p-1.5 pl-4">
        <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe a Donna…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground" aria-label="Enviar"><ArrowUp className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
