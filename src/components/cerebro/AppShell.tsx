import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Sun, CalendarDays, CheckSquare, Shapes, Plus, Moon, SunMoon, Library, Home as HomeIcon, Server } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { captureIdea } from "@/lib/cerebro-store";
import { toggleDonna } from "@/components/cerebro/Donna";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Header() {
  const now = useNow();
  const { theme, mode, cycle } = useTheme();
  const [idea, setIdea] = useState("");
  const [saved, setSaved] = useState(false);
  const ThemeIcon = mode === "auto" ? SunMoon : theme === "light" ? Sun : Moon;

  return (
    <header className="flex items-center gap-4 px-6 pt-5">
      <div className="min-w-0">
        <p className="label-os">cerebro</p>
        <p className="mt-0.5 font-mono text-2xl font-medium tabular-nums">
          {now ? now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          <span className="ml-3 align-middle font-sans text-sm font-normal capitalize text-muted-foreground">
            {now ? now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" }) : ""}
          </span>
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (!idea.trim()) return; captureIdea(idea); setIdea(""); setSaved(true); setTimeout(() => setSaved(false), 1600); }}
        className="ml-auto flex h-11 w-full max-w-sm items-center gap-2 rounded-full border bg-card/60 px-4"
      >
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={saved ? "Guardado en el Inbox" : "Captura rápida…"}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>

      <Link to="/sistema" className="hidden h-11 items-center gap-2 rounded-full border px-4 md:flex" title="Estado del servidor">
        <Server className="h-4 w-4 text-muted-foreground" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <span className="label-os">no conectado</span>
      </Link>

      <button onClick={cycle} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border" aria-label="Cambiar tema" title={mode === "auto" ? "Tema automático por horario" : `Tema ${theme}`}>
        <ThemeIcon className="h-4 w-4" />
      </button>
    </header>
  );
}

const left = [
  { to: "/", label: "Hoy", icon: Sun },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
] as const;
const right = [
  { to: "/tareas", label: "Tareas", icon: CheckSquare },
  { to: "/areas", label: "Áreas", icon: Shapes },
] as const;
const more = [
  { to: "/biblioteca", label: "Biblioteca", icon: Library },
  { to: "/casa", label: "Casa", icon: HomeIcon },
] as const;

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Sun }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="flex min-h-[52px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-3 text-muted-foreground transition-colors hover:text-foreground"
      activeProps={{ className: "!text-foreground bg-accent" }}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-fit items-center gap-1 rounded-[28px] glass bg-glass-strong p-1.5">
      {left.map((i) => <NavItem key={i.to} {...i} />)}
      <button onClick={toggleDonna} aria-label="Hablar con Donna" className="mx-2 grid h-14 w-14 place-items-center rounded-full">
        <span className="h-12 w-12 rounded-full bg-orb animate-orb" />
      </button>
      {right.map((i) => <NavItem key={i.to} {...i} />)}
      <span className="mx-1 h-8 w-px bg-border" />
      {more.map((i) => <NavItem key={i.to} {...i} />)}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/focus")) return <>{children}</>;
  return (
    <div className="min-h-screen pb-28">
      <Header />
      {children}
      <BottomNav />
    </div>
  );
}

export function Placeholder({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-10">
      <p className="label-os">{label}</p>
      <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
      <div className="mt-8 rounded-3xl border border-dashed p-10 text-muted-foreground">
        <p className="max-w-xl leading-relaxed">{text}</p>
        <p className="label-os mt-6">en construcción · próxima fase</p>
      </div>
    </main>
  );
}
