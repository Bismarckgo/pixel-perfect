import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pause, Play, Square, Plus, Check } from "lucide-react";
import { useCerebro, captureIdea, setState } from "@/lib/cerebro-store";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus Mode — Cerebro" },
      { name: "description", content: "Una sola tarea, un pomodoro y nada más." },
      { property: "og:title", content: "Focus Mode — Cerebro" },
      { property: "og:description", content: "Una sola tarea, un pomodoro y nada más." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Focus,
});

function Focus() {
  const s = useCerebro();
  const navigate = useNavigate();
  const total = s.duration * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [idea, setIdea] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => setLeft(s.duration * 60), [s.duration]);

  useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => setLeft((l) => {
      if (l <= 1) {
        setDone(true);
        setState((x) => ({ ...x, pomodoros: x.pomodoros + 1 }));
        return 0;
      }
      return l - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const R = 140, C = 2 * Math.PI * R;
  const progress = 1 - left / total;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <p className="label-os">focus mode · {s.task.area}</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-semibold md:text-5xl">{s.task.title}</h1>
      <p className="mt-3 text-muted-foreground">Siguiente: {s.task.next}</p>

      <div className="relative my-12 h-80 w-80">
        <svg viewBox="0 0 320 320" className="h-full w-full -rotate-90">
          <circle cx="160" cy="160" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle
            cx="160" cy="160" r={R} fill="none"
            stroke={done ? "var(--success)" : "var(--signal)"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 12px var(--signal))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {done ? (
            <div className="animate-reward flex flex-col items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-success text-background"><Check className="h-8 w-8" /></span>
              <p className="mt-4 font-display text-xl">Sesión completada</p>
              <p className="label-os mt-1">pomodoro #{s.pomodoros}</p>
            </div>
          ) : (
            <>
              <p className="font-mono text-7xl font-medium tabular-nums">{mm}:{ss}</p>
              <p className="label-os mt-2">{running ? "en foco" : "en pausa"}</p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {!done && (
          <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-display">
            {running ? <><Pause className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4" /> Seguir</>}
          </button>
        )}
        <button onClick={() => navigate({ to: "/" })} className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-display">
          <Square className="h-4 w-4" /> Terminar
        </button>
        <button onClick={() => setCapturing(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-primary-foreground glow-primary">
          <Plus className="h-4 w-4" /> Capturar idea
        </button>
      </div>

      {capturing && (
        <form
          onSubmit={(e) => {
            e.preventDefault(); captureIdea(idea); setIdea(""); setCapturing(false);
            setSaved(true); setTimeout(() => setSaved(false), 1800);
          }}
          className="mt-6 flex w-full max-w-md items-center gap-2 rounded-2xl glass p-2 animate-in fade-in slide-in-from-bottom-2"
        >
          <input autoFocus value={idea} onChange={(e) => setIdea(e.target.value)} onBlur={() => !idea && setCapturing(false)}
            placeholder="La idea va al Inbox…" className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" />
          <button className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">Guardar</button>
        </form>
      )}
      {saved && <p className="mt-4 text-sm text-success animate-in fade-in">Guardada en el Inbox. Sigue.</p>}

      <Link to="/" className="label-os mt-12 hover:text-foreground">← volver a home</Link>
    </main>
  );
}
