import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, MapPin, Sun, Moon, Cloud, CloudRain, CloudFog, Snowflake, CloudLightning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgendaPanel } from "@/components/cerebro/AgendaPanel";
import { useNavigate } from "@tanstack/react-router";
import { useTimer, updateTimer, startTimer } from "@/lib/timer-store";
import { dayKey } from "@/lib/pomodoro";
import { prepareSessionDisplay } from "@/lib/device-apis";
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
    <Button variant="ghost" onClick={() => setEditing(true)} className="mt-4 flex min-h-12 items-center gap-4 rounded-2xl text-left active:opacity-70" aria-label={`Clima en ${place.name}. Cambiar ciudad`}>
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
            <span className="flex items-center gap-1 font-mono text-[13px] text-muted-foreground"><MapPin className="h-3 w-3" />{place.name} · Sensación {data.feels}°</span>
          </span>
        </>
      )}
    </Button>
  );
}

function Ring({ done, total }: { done: number; total: number }) {
 const pct = total ? Math.round(done / total * 100) : 0;
 return <div className="relative h-20 w-20 shrink-0"><svg viewBox="0 0 80 80" className="h-full w-full -rotate-90"><circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6" /><circle cx="40" cy="40" r="32" fill="none" stroke="var(--primary)" strokeWidth="6" strokeDasharray="201.06" strokeDashoffset={201.06 * (1-pct/100)} strokeLinecap="round" /></svg><span className="absolute inset-0 grid place-items-center font-mono text-base">{pct}%</span></div>;
}
function Tareas() {
 const tasks = useTasks().filter((t) => t.col !== "unassigned"); const done = tasks.filter((t) => t.col === "done").length;
 const ordered = [...tasks.filter((t) => t.col === "doing"), ...tasks.filter((t) => t.col === "todo"), ...tasks.filter((t) => t.col === "done")].slice(0,3);
 return <section className="home-surface" aria-label="Tareas de hoy"><div className="flex items-center gap-5"><Ring done={done} total={tasks.length} /><div><Link to="/tareas" className="label-os inline-flex min-h-12 items-center">Tareas <ArrowUpRight size={18} /></Link><p className="text-xl font-semibold">{tasks.length - done} cosas en tu radar</p></div></div><ul className="mt-4 space-y-2">{ordered.map((t) => { const a = areaStyle(t.area); return <li key={t.id}><Button variant="ghost" onClick={() => toggleDone(t.id)} aria-pressed={t.col === "done"} className="home-task"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${t.col === "done" ? "bg-primary border-primary text-primary-foreground" : ""}`}>{t.col === "done" && <Check size={18} />}</span><span className="min-w-0"><span className={`block whitespace-normal ${t.col === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</span><span className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground"><a.icon size={16} style={{ color: a.color }} />{t.area}{t.demo ? " · Demo" : ""}</span></span></Button></li>; })}</ul></section>;
}
function Foco() {
 const tasks = useTasks().filter((t) => t.col === "todo" || t.col === "doing"); const timer = useTimer(); const navigate = useNavigate(); const [choosing, setChoosing] = useState(false); const task = tasks.find((t) => t.id === timer.focusId) ?? tasks[0]; const active = timer.session?.state === "running" || timer.session?.state === "paused"; const [today] = useState(() => dayKey(Date.now()));
 const a = areaStyle(task?.area ?? "Sistema");
 return <section className="home-surface mt-6"><p className="label-os flex items-center gap-2"><a.icon size={18} style={{ color: a.color }} />Foco ahora</p><Button variant="ghost" className="my-3 h-auto min-h-14 w-full justify-start whitespace-normal px-0 text-left font-mono text-lg font-bold" onClick={() => setChoosing((v) => !v)}>{task?.title ?? "Sin tareas pendientes"}</Button>{choosing && <select className="tablet-input mb-3 w-full" aria-label="Elegir tarea en foco" value={task?.id ?? ""} onChange={(e) => { updateTimer((d) => ({ ...d, focusId: e.target.value })); setChoosing(false); }}>{tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select>}<Button className="w-full" disabled={!task && !active} onClick={() => { if (active || (task && startTimer(task.id, timer.minutes))) { prepareSessionDisplay(); void navigate({ to: "/focus" }); } }}>{active ? "Volver al Pomodoro" : "Empezar"}</Button><div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Duración del Pomodoro">{([25,50] as const).map((min) => <Button key={min} variant={timer.minutes === min ? "secondary" : "ghost"} aria-pressed={timer.minutes === min} disabled={active} onClick={() => updateTimer((d) => ({ ...d, minutes: min }))}>{min} min</Button>)}</div><p className="mt-3 text-[13px] text-muted-foreground">{timer.history.filter((r) => r.day === today).length} pomodoros hoy{task?.demo ? " · Tarea Demo" : ""}</p></section>;
}
function Hoy() {
 const m = useMoment(); const [clock, setClock] = useState("");
 useEffect(() => { const update = () => setClock(new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })); update(); const id = setInterval(update, 15000); return () => clearInterval(id); }, []);
 return <main className="home-layout"><aside className="home-left"><h1 className="text-3xl font-semibold leading-tight">{m.greet},<br />Bismarck.</h1><p className="mt-3 text-base capitalize text-muted-foreground">{m.date}</p><p className="mt-2 font-mono text-2xl">{clock || "—"}</p><Clima /><Foco /></aside><div className="home-right"><section className="home-surface"><Link to="/calendario" className="label-os inline-flex min-h-12 items-center gap-2">Calendario <ArrowUpRight size={18} /></Link><AgendaPanel compact /></section><Tareas /></div></main>;
}
