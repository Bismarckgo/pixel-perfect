import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Music, Brain, CheckSquare, Folder, Zap, BookOpen, Lightbulb, SquareStack,
  Server, Clapperboard, Settings, Play, Inbox as InboxIcon, Plus, SkipBack, SkipForward,
} from "lucide-react";
import { useCerebro, captureIdea, setState } from "@/lib/cerebro-store";
import { Donna } from "@/components/cerebro/Donna";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cerebro — Personal Life OS" },
      { name: "description", content: "Cerebro: el sistema operativo visual de tu vida, tu trabajo creativo y tus proyectos." },
      { property: "og:title", content: "Cerebro — Personal Life OS" },
      { property: "og:description", content: "El sistema operativo visual de tu vida creativa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const apps = [
  { name: "Música", icon: Music, tone: "bg-signal-gradient" },
  { name: "Proyectos", icon: Brain, tone: "bg-primary" },
  { name: "Tareas", icon: CheckSquare, tone: "bg-success" },
  { name: "Archivos", icon: Folder, tone: "bg-cyan" },
  { name: "Automatizar", icon: Zap, tone: "bg-signal" },
  { name: "Conocimiento", icon: BookOpen, tone: "bg-secondary" },
  { name: "Ideas", icon: Lightbulb, tone: "bg-secondary" },
  { name: "Decisiones", icon: SquareStack, tone: "bg-secondary" },
  { name: "Servidor", icon: Server, tone: "bg-secondary" },
  { name: "Ocio", icon: Clapperboard, tone: "bg-secondary" },
  { name: "Sistema", icon: Settings, tone: "bg-secondary" },
];

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl glass p-5 ${className}`}>{children}</section>;
}

function Home() {
  const s = useCerebro();
  const now = useNow();
  const [idea, setIdea] = useState("");
  const hour = now?.getHours() ?? 9;
  const greet = hour < 12 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches";

  return (
    <main className="mx-auto max-w-7xl px-5 pb-40 pt-8 md:px-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="label-os">cerebro · personal os</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{greet}, Bismarck.</h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-4xl font-medium tabular-nums md:text-6xl">
            {now ? now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </p>
          <p className="label-os mt-1">
            {now ? now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" }) : ""}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* AHORA */}
        <Card className="relative overflow-hidden md:col-span-7 md:row-span-2 md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-signal opacity-20 blur-3xl" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal glow-signal" />
            <p className="label-os">ahora · {s.task.area}</p>
          </div>
          <p className="mt-6 text-5xl">{s.task.icon}</p>
          <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight md:text-5xl">{s.task.title}</h2>
          <div className="mt-6 border-l-2 border-signal pl-4">
            <p className="label-os">siguiente acción</p>
            <p className="mt-1 text-lg">{s.task.next}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/focus"
              className="inline-flex items-center gap-2 rounded-full bg-signal-gradient px-7 py-3.5 font-display font-semibold text-signal-foreground glow-signal transition hover:scale-[1.02]"
            >
              <Play className="h-4 w-4 fill-current" /> Empezar
            </Link>
            <div className="flex rounded-full border p-1">
              {[25, 50].map((m) => (
                <button
                  key={m}
                  onClick={() => setState((x) => ({ ...x, duration: m }))}
                  className={`rounded-full px-4 py-2 font-mono text-xs ${s.duration === m ? "bg-accent text-foreground" : "text-muted-foreground"}`}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* PRIORIDADES */}
        <Card className="md:col-span-5">
          <p className="label-os">prioridades</p>
          <ol className="mt-4 space-y-2">
            {s.priorities.map((p, i) => (
              <li key={p} className="flex items-center gap-4 rounded-2xl bg-background/30 px-4 py-3">
                <span className={`font-mono text-2xl font-medium ${i === 0 ? "text-signal" : "text-muted-foreground"}`}>0{i + 1}</span>
                <span className="font-display text-lg font-medium">{p}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* FOCO DEL DÍA */}
        <Card className="md:col-span-2">
          <p className="label-os">pomodoros</p>
          <p className="mt-3 font-mono text-5xl font-medium text-primary">{s.pomodoros}</p>
          <p className="mt-1 text-xs text-muted-foreground">completados</p>
        </Card>

        {/* SERVIDOR */}
        <Card className="md:col-span-3">
          <div className="flex items-center justify-between">
            <p className="label-os">servidor</p>
            <span className="flex items-center gap-1.5 text-xs text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[["CPU", "18%"], ["RAM", "41%"], ["Disco", "62%"]].map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-lg">{v}</p>
                <p className="label-os">{k}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Docker · PostgreSQL · n8n — todo funcionando</p>
        </Card>

        {/* INBOX */}
        <Card className="md:col-span-5">
          <div className="flex items-center justify-between">
            <p className="label-os flex items-center gap-2"><InboxIcon className="h-3 w-3" /> inbox</p>
            <span className="font-mono text-xs text-muted-foreground">{s.inbox.length}</span>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); captureIdea(idea); setIdea(""); }}
            className="mt-3 flex items-center gap-2 rounded-2xl border bg-background/30 px-3 py-2"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Capturar idea…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>
          <ul className="mt-3 space-y-1">
            {s.inbox.slice(0, 4).map((i) => (
              <li key={i.id} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm hover:bg-accent/50">
                <span className="truncate">{i.text}</span>
                <button
                  onClick={() => setState((x) => ({ ...x, inbox: x.inbox.filter((y) => y.id !== i.id) }))}
                  className="label-os hover:text-foreground"
                >
                  hecho
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* MÚSICA */}
        <Card className="md:col-span-4">
          <p className="label-os">en reproducción</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-signal-gradient" />
            <div className="min-w-0">
              <p className="truncate font-display font-medium">Chicas malas — mix v7</p>
              <p className="font-mono text-xs text-muted-foreground">94 BPM · Am</p>
            </div>
          </div>
          <div className="mt-4 flex h-8 items-end gap-[3px]">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className="flex-1 rounded-full bg-cyan/70" style={{ height: `${20 + Math.abs(Math.sin(i * 1.7)) * 80}%` }} />
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-6 text-muted-foreground">
            <SkipBack className="h-4 w-4" /><Play className="h-4 w-4 text-foreground" /><SkipForward className="h-4 w-4" />
          </div>
        </Card>

        {/* AUTOMATIZACIONES */}
        <Card className="md:col-span-3">
          <p className="label-os">automatizaciones</p>
          <ul className="mt-4 space-y-2 text-sm">
            {["Downloads Organizer", "Telegram → Cerebro", "Backup nocturno"].map((a, i) => (
              <li key={a} className="flex items-center gap-2">
                <Zap className={`h-3.5 w-3.5 ${i === 2 ? "text-muted-foreground" : "text-signal"}`} />
                <span className="flex-1 truncate">{a}</span>
                <span className="label-os">{i === 2 ? "03:00" : "activa"}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* APP DOCK */}
      <nav className="fixed inset-x-0 bottom-6 z-30 mx-auto w-fit max-w-[calc(100vw-10rem)] overflow-x-auto rounded-3xl glass bg-glass-strong p-2">
        <ul className="flex gap-2">
          {apps.map(({ name, icon: Icon, tone }) => (
            <li key={name}>
              <button title={name} className="group flex flex-col items-center gap-1 px-1">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tone} transition group-hover:-translate-y-1`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="hidden text-[10px] text-muted-foreground lg:block">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <Donna />
    </main>
  );
}
