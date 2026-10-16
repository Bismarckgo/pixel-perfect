import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, MapPin, Sun, Moon, Cloud, CloudRain, CloudFog, Snowflake, CloudLightning } from "lucide-react";
import { demoEvents } from "@/lib/demo-data";
import { describe, fetchWeather, geocodeCity, usePlace } from "@/lib/weather";
import { useTasks, toggleDone } from "@/lib/board";
import { areaStyle } from "@/lib/areas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoy — Cerebro" },
      { name: "description", content: "Tu día de un vistazo: tareas, próximos compromisos, progreso y clima." },
      { property: "og:title", content: "Hoy — Cerebro" },
      { property: "og:description", content: "Tu día de un vistazo: tareas, próximos compromisos, progreso y clima." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Hoy,
});

function useMoment() {
  const [m, setM] = useState<{ greet: string; date: string }>({ greet: "Hola", date: "" });
  useEffect(() => {
    const d = new Date();
    const h = d.getHours();
    setM({
      greet: h >= 5 && h < 12 ? "Buenos días" : h >= 12 && h < 19 ? "Buenas tardes" : "Buenas noches",
      date: d.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" }),
    });
  }, []);
  return m;
}

function weatherIcon(code: number, isDay: boolean) {
  if (code === 0) return isDay ? Sun : Moon;
  if (code <= 3) return Cloud;
  if (code <= 48) return CloudFog;
  if (code <= 67 || (code >= 80 && code <= 82)) return CloudRain;
  if (code <= 77) return Snowflake;
  return CloudLightning;
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
  if (editing)
    return (
      <form className="mt-4 max-w-xs" onSubmit={async (e) => {
        e.preventDefault(); setErr("");
        const p = await geocodeCity(q).catch(() => null);
        if (p) { setPlace(p); setEditing(false); setQ(""); } else setErr("No encontré esa ciudad.");
      }}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => !q && setEditing(false)} placeholder="Ciudad…" className="h-12 w-full rounded-2xl border bg-transparent px-4 text-base outline-none" />
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      </form>
    );
  const Icon = data ? weatherIcon(data.code, data.isDay) : Cloud;
  return (
    <button onClick={() => setEditing(true)} className="mt-4 flex min-h-12 items-center gap-4 rounded-2xl text-left active:opacity-70" aria-label={`Clima en ${place.name}. Cambiar ciudad`}>
      {isLoading ? (
        <span className="text-sm text-muted-foreground">Consultando el clima…</span>
      ) : isError || !data ? (
        <span className="text-sm text-muted-foreground">Clima sin conexión</span>
      ) : (
        <>
          <Icon className="h-9 w-9 text-sand" strokeWidth={1.5} />
          <span className="font-mono text-4xl font-medium tabular-nums">{data.temp}°</span>
          <span className="leading-tight">
            <span className="block text-sm">{describe(data.code)}</span>
            <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{place.name} · {data.max}°/{data.min}°</span>
          </span>
        </>
      )}
    </button>
  );
}

function Ring({ done, total }: { done: number; total: number }) {
  const r = 30, c = 2 * Math.PI * r, pct = total ? done / total : 0;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-sm font-medium tabular-nums">{done}/{total}</span>
    </div>
  );
}

function Tareas() {
  const tasks = useTasks();
  const done = tasks.filter((t) => t.col === "done").length;
  const ordered = [...tasks.filter((t) => t.col === "doing"), ...tasks.filter((t) => t.col === "todo"), ...tasks.filter((t) => t.col === "done")];
  return (
    <section className="flex min-h-0 flex-col rounded-3xl surface p-6" aria-label="Tareas de hoy">
      <div className="flex items-center gap-5">
        <Ring done={done} total={tasks.length} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><p className="label-os">tareas de hoy</p><span className="label-os">· demo</span></div>
          <p className="mt-1 text-xl font-semibold">{done === tasks.length && tasks.length ? "Todo hecho." : `${tasks.length - done} pendientes`}</p>
        </div>
        <Link to="/tareas" className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground active:bg-accent">Kanban <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
      <ul className="mt-4 -mx-2 overflow-y-auto">
        {ordered.map((t) => {
          const a = areaStyle(t.area);
          const isDone = t.col === "done";
          return (
            <li key={t.id}>
              <button onClick={() => toggleDone(t.id)} aria-pressed={isDone} className="flex min-h-14 w-full items-center gap-4 rounded-2xl px-2 py-2 text-left transition-colors active:bg-accent">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-colors ${isDone ? "border-primary bg-primary text-primary-foreground" : ""}`}>
                  {isDone && <Check className="h-4 w-4 animate-reward" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-base ${isDone ? "text-muted-foreground line-through" : ""}`}>{t.title}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} /> {t.area}{t.col === "doing" && !isDone ? " · en proceso" : ""}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Agenda() {
  return (
    <Link to="/calendario" className="block rounded-3xl surface p-6 transition-transform active:scale-[0.99]" aria-label="Abrir calendario">
      <div className="flex items-center justify-between">
        <p className="label-os">próximo · demo</p>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </div>
      <ul className="mt-4 space-y-1">
        {demoEvents.map((e) => {
          const a = areaStyle(e.area);
          return (
            <li key={e.title} className="flex min-h-14 items-center gap-4 border-l-2 pl-4" style={{ borderColor: a.color }}>
              <span className="w-14 shrink-0 font-mono text-lg tabular-nums">{e.time}</span>
              <span className="min-w-0">
                <span className="block truncate text-base">{e.title}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />{e.area}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </Link>
  );
}

function Hoy() {
  const m = useMoment();
  return (
    <main className="mx-auto max-w-[1180px] px-6 pt-2 md:px-8">
      <section className="-mt-14 max-w-[60%]">
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{m.greet}, Bismarck.</h1>
        <p className="mt-1 text-lg text-muted-foreground">{m.date.charAt(0).toUpperCase() + m.date.slice(1)}</p>
        <Clima />
      </section>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <Agenda />
        <Tareas />
      </div>
    </main>
  );
}
