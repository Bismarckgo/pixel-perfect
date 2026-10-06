import { useState } from "react";
import { X, ArrowUp, Mic } from "lucide-react";
import { captureIdea, useCerebro } from "@/lib/cerebro-store";

const suggestions = [
  "Recuérdame esto mañana",
  "¿Qué tengo pendiente de Cerebro?",
  "Organiza esta idea",
  "Abre mi proyecto de música",
];

type Msg = { from: "me" | "donna"; text: string };

export function Donna() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const s = useCerebro();

  function send(t: string) {
    const v = t.trim();
    if (!v) return;
    let reply = "Lo guardé en tu Inbox. Lo procesamos cuando termines lo que estás haciendo.";
    if (/pendiente|qué tengo/i.test(v)) {
      reply = `Ahora: ${s.task.title}. Tienes ${s.inbox.length} ideas en el Inbox. Prioridades: ${s.priorities.join(" → ")}.`;
    } else {
      captureIdea(v);
    }
    setMsgs((m) => [...m, { from: "me", text: v }, { from: "donna", text: reply }]);
    setText("");
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir Donna"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full glass py-2 pl-2 pr-5 transition hover:scale-[1.02]"
      >
        <span className="h-10 w-10 rounded-full bg-orb animate-orb" />
        <span className="font-display text-sm font-semibold tracking-wide">DONNA</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[32rem] w-[min(26rem,calc(100vw-3rem))] flex-col rounded-3xl glass bg-glass-strong p-5 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-orb" />
              <div>
                <p className="font-display font-semibold">Donna</p>
                <p className="label-os">asistente del sistema</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Cerrar">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
            {msgs.length === 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">¿En qué te ayudo?</p>
                {suggestions.map((q) => (
                  <button key={q} onClick={() => send(q)} className="block w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-accent">
                    {q}
                  </button>
                ))}
              </div>
            ) : (
              msgs.map((m, i) => (
                <div key={i} className={m.from === "me" ? "ml-auto max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground" : "max-w-[90%] text-sm leading-relaxed"}>
                  {m.text}
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(text); }}
            className="mt-3 flex items-center gap-2 rounded-2xl border bg-background/40 p-2"
          >
            <button type="button" className="p-2 text-muted-foreground" aria-label="Hablar"><Mic className="h-4 w-4" /></button>
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Habla con Donna…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-xl bg-primary p-2 text-primary-foreground" aria-label="Enviar"><ArrowUp className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
