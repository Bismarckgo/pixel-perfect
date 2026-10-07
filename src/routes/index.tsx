import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Play, Check, AlertTriangle, X, Undo2, MapPin } from "lucide-react";
import { useCerebro, setState } from "@/lib/cerebro-store";
import { toggleDonna } from "@/components/cerebro/Donna";
import { demoEvents, demoFocusTasks, demoGoals, demoReceipts } from "@/lib/demo-data";
import { describe, fetchWeather, geocodeCity, usePlace } from "@/lib/weather";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoy — Cerebro" },
      { name: "description", content: "Lo que estás haciendo ahora, tu día y lo que Donna hizo por ti." },
      { property: "og:title", content: "Hoy — Cerebro" },
      { property: "og:description", content: "Lo que estás haciendo ahora, tu día y lo que Donna hizo por ti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Hoy,
});

const Demo = () => <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">demo</span>;

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl surface p-5 ${className}`}>{children}</section>;
}

function useGreeting() {
  const [g, setG] = useState("Hola");
  useEffect(() => {
    const h = new Date().getHours();
    setG(h >= 16 && h < 19 ? "Buenas tardes" : h >= 19 || h < 5 ? "Buenas noches" : "Buen día");
  }, []);
  return g;
}

function DonnaHero() {
  const greet = useGreeting();
  const s = useCerebro();
  return (
    <Panel className="col-span-12 flex items-center gap-6 lg:col-span-5 lg:row-span-2 lg:flex-col lg:items-start lg:justify-between">
      <button onClick={toggleDonna} aria-label="Hablar con Donna" className="shrink-0">
        <span className="block h-24 w-24 rounded-full bg-orb animate-orb lg:h-32 lg:w-32" />
      </button>
      <div>
        <p className="label-os">donna</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">{greet}, Bismarck.</h1>
        <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
          Hoy toca una cosa: <span className="text-foreground">{s.task.title}</span>. Tienes {s.inbox.length} ideas esperando en el Inbox; no se van a ir.
        </p>
        <button onClick={toggleDonna} className="mt-5 min-h-11 rounded-full border px-5 text-sm hover:bg-accent">Hablar con Donna</button>
      </div>
    </Panel>
  );
}

function Foco() {
  const s = useCerebro();
  return (
    <Panel className="col-span-12 lg:col-span-7">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <p className="label-os">foco ahora · {s.task.area}</p>
      </div>
      <h2 className="mt-3 text-3xl font-semibold leading-tight">{s.task.title}</h2>
      <p className="mt-2 text-muted-foreground">Siguiente paso: <span className="text-foreground">{s.task.next}</span></p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link to="/focus" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground glow-primary">
          <Play className="h-4 w-4 fill-current" /> Empezar
        </Link>
        <div className="flex rounded-full border p-1">
          {[25, 50].map((m) => (
            <button key={m} onClick={() => setState((x) => ({ ...x, duration: m }))}
              className={`min-h-10 rounded-full px-4 font-mono text-xs ${s.duration === m ? "bg-accent text-foreground" : "text-muted-foreground"}`}>
              {m} min
            </button>
          ))}
        </div>
        <span className="ml-auto font-mono text-xs text-muted-foreground">{s.pomodoros} pomodoros hoy</span>
      </div>
    </Panel>
  );
}

function HoyList() {
  return (
    <Panel className="col-span-12 md:col-span-7 lg:col-span-4">
      <div className="flex items-center justify-between"><p className="label-os">hoy</p><Demo /></div>
      <ul className="mt-3 space-y-2.5">
        {demoEvents.map((e) => (
          <li key={e.title} className="flex gap-3 text-sm">
            <span className="w-11 shrink-0 font-mono text-muted-foreground">{e.time}</span>
            <span>{e.title}</span>
          </li>
        ))}
      </ul>
      <div className="my-4 h-px bg-border" />
      <p className="label-os">3 en foco</p>
      <ol className="mt-2 space-y-2">
        {demoFocusTasks.map((t, i) => (
          <li key={t.title} className="flex gap-3 text-sm">
            <span className={`font-mono ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>0{i + 1}</span>
            <span className="flex-1">{t.title}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function Clima() {
  const { place, setPlace } = usePlace();
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["weather", place.lat, place.lon],
    queryFn: () => fetchWeather(place),
    staleTime: 15 * 60_000,
  });
  return (
    <Panel className="col-span-12 md:col-span-5 lg:col-span-3">
      <div className="flex items-center justify-between">
        <p className="label-os">clima</p>
        <button onClick={() => setEditing((e) => !e)} className="flex min-h-9 items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <MapPin className="h-3.5 w-3.5" /> {place.name}
        </button>
      </div>
      {editing ? (
        <form className="mt-3" onSubmit={async (e) => {
          e.preventDefault(); setErr("");
          const p = await geocodeCity(q).catch(() => null);
          if (p) { setPlace(p); setEditing(false); setQ(""); } else setErr("No encontré esa ciudad.");
        }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ciudad…" className="h-11 w-full rounded-xl border bg-transparent px-3 text-sm outline-none" />
          {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
        </form>
      ) : isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Consultando…</p>
      ) : isError || !data ? (
        <p className="mt-4 text-sm text-muted-foreground">Sin conexión con el servicio del clima.</p>
      ) : (
        <>
          <p className="mt-3 font-mono text-5xl font-medium">{data.temp}°</p>
          <p className="mt-1 text-sm">{describe(data.code)}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">máx {data.max}° · mín {data.min}°</p>
        </>
      )}
    </Panel>
  );
}

function Ring({ value }: { value: number | null }) {
  const R = 22, C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
      <circle cx="28" cy="28" r={R} fill="none" stroke="var(--border)" strokeWidth="5" />
      {value !== null && <circle cx="28" cy="28" r={R} fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - value)} />}
    </svg>
  );
}

function Progreso() {
  return (
    <Panel className="col-span-12 lg:col-span-6">
      <div className="flex items-center justify-between"><p className="label-os">largo plazo</p><Demo /></div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {demoGoals.map((g) => (
          <div key={g.name} className="flex items-center gap-3">
            <Ring value={g.progress} />
            <div className="min-w-0">
              <p className="truncate font-medium">{g.name}</p>
              <p className={`text-xs ${g.progress === null ? "text-sand" : "text-muted-foreground"}`}>
                {g.progress === null ? g.note : `${Math.round(g.progress * 100)}% · ${g.note}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const icon = { ok: Check, warn: AlertTriangle, fail: X };
const tone = { ok: "text-success", warn: "text-warning", fail: "text-destructive" };

function Recibos() {
  return (
    <Panel className="col-span-12 lg:col-span-6">
      <div className="flex items-center justify-between"><p className="label-os">donna hizo hoy</p><Demo /></div>
      <ul className="mt-3 space-y-2">
        {demoReceipts.map((r) => {
          const I = icon[r.status];
          return (
            <li key={r.text} className="flex items-center gap-3 text-sm">
              <I className={`h-4 w-4 shrink-0 ${tone[r.status]}`} />
              <span className="flex-1">{r.text}</span>
              <span className="font-mono text-xs text-muted-foreground">{r.at}</span>
              <button disabled title="Disponible con datos reales" className="flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs text-muted-foreground opacity-50">
                <Undo2 className="h-3.5 w-3.5" /> Deshacer
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function Hoy() {
  return (
    <main className="mx-auto grid max-w-[1180px] grid-cols-12 gap-4 px-6 pt-6">
      <DonnaHero />
      <Foco />
      <HoyList />
      <Clima />
      <Progreso />
      <Recibos />
    </main>
  );
}
