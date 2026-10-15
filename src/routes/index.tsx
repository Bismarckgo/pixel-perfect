import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Play, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCerebro, setState } from "@/lib/cerebro-store";
import { toggleDonna } from "@/components/cerebro/Donna";
import { demoEvents } from "@/lib/demo-data";
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

function useGreeting() {
  const [g, setG] = useState("Hola");
  useEffect(() => {
    const h = new Date().getHours();
    setG(h >= 16 && h < 19 ? "Buenas tardes" : h >= 19 || h < 5 ? "Buenas noches" : "Buen día");
  }, []);
  return g;
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
    <section className="border-l pl-6">
      <div className="flex items-center justify-between">
        <p className="label-os">clima</p>
        <Button variant="ghost" onClick={() => setEditing((e) => !e)} className="min-h-11 px-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {place.name}
        </Button>
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
          <p className="mt-3 font-mono text-3xl font-medium">{data.temp}°</p>
          <p className="mt-1 text-sm">{describe(data.code)}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">máx {data.max}° · mín {data.min}°</p>
        </>
      )}
    </section>
  );
}


function Hoy() {
  const s = useCerebro();
  const greet = useGreeting();
  return (
    <main className="mx-auto max-w-[1133px] px-8 pt-8">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <section className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <Button variant="ghost" onClick={toggleDonna} aria-label="Hablar con Donna" className="mb-7 h-32 w-32 rounded-full p-0 hover:bg-transparent">
            <span className="block h-28 w-28 rounded-full bg-orb animate-orb" />
          </Button>
          <p className="label-os">donna</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">{greet}, Bismarck.</h1>
          <Button variant="ghost" onClick={toggleDonna} className="mt-3 min-h-11 text-muted-foreground">Hablemos <ArrowUpRight /></Button>
        </section>
        <section className="rounded-3xl surface p-7" aria-label="Foco actual">
          <div className="flex items-center justify-between gap-3">
            <p className="label-os">foco ahora · {s.task.area}</p>
            <span className="label-os">Demo</span>
          </div>
          <h2 className="mt-5 text-3xl font-semibold leading-tight">{s.task.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.task.next}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild className="min-h-12 rounded-full px-6"><Link to="/focus"><Play className="fill-current" /> Empezar</Link></Button>
            <div className="flex rounded-full border p-1" role="group" aria-label="Duración del foco">
              {[25, 50].map((m) => <Button key={m} variant="ghost" aria-pressed={s.duration === m} onClick={() => setState((x) => ({ ...x, duration: m }))} className={`h-11 rounded-full px-4 font-mono text-xs ${s.duration === m ? "bg-accent text-foreground" : "text-muted-foreground"}`}>{m} min</Button>)}
            </div>
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">{s.pomodoros} pomodoros hoy</p>
        </section>
      </div>
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)_minmax(180px,0.45fr)] gap-6 border-t py-5">
        <section>
          <div className="flex items-center justify-between gap-3"><p className="label-os">tu día · demo</p><Button asChild variant="ghost" className="min-h-11 text-xs text-muted-foreground"><Link to="/calendario">Calendario <ArrowUpRight /></Link></Button></div>
          <ul className="mt-2 space-y-3">{demoEvents.map((e) => <li key={e.title} className="flex gap-4 text-sm"><span className="shrink-0 font-mono text-muted-foreground">{e.time}</span><span>{e.title}</span></li>)}</ul>
        </section>
        <Clima />
      </div>
    </main>
  );
}
