import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, type SVGProps } from "react";
import { Sun, CalendarDays, CheckSquare, Shapes, Moon, SunMoon, Library, Server, Bell, MoreHorizontal } from "lucide-react";
import { useTheme } from "@/lib/theme";
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

/** Icono de Ocio: control remoto. */
export function RemoteIcon({ className, strokeWidth = 1.75 }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="5" />
      <circle cx="12" cy="8" r="2" />
      <path d="M10 13h.01M14 13h.01M10 16.5h.01M14 16.5h.01" />
    </svg>
  );
}

function StatusControls() {
  const { theme, mode, cycle } = useTheme();
  const [open, setOpen] = useState(false);
  const ThemeIcon = mode === "auto" ? SunMoon : theme === "light" ? Sun : Moon;
  return (
    <div className="relative ml-auto flex shrink-0 items-center gap-2">
      <Link to="/sistema" className="flex h-11 items-center gap-2 rounded-full border px-4 active:bg-accent" title="Estado del servidor">
        <Server className="h-4 w-4 text-muted-foreground" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <span className="label-os hidden sm:inline">no conectado</span>
      </Link>
      <button onClick={() => setOpen((o) => !o)} aria-label="Notificaciones" aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground active:scale-95">
        <Bell className="h-4 w-4" />
      </button>
      <button onClick={cycle} className="grid h-11 w-11 place-items-center rounded-full border active:bg-accent" aria-label="Cambiar tema">
        <ThemeIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-14 z-40 w-72 rounded-3xl glass bg-glass-strong p-5">
          <p className="label-os">notificaciones</p>
          <p className="mt-3 text-sm text-muted-foreground">Sin notificaciones. Cuando Cerebro esté conectado a tu servidor, aparecerán aquí.</p>
        </div>
      )}
    </div>
  );
}

function Header({ home }: { home: boolean }) {
  const now = useNow();
  return (
    <header className="flex items-center gap-4 px-6 pt-5">
      {!home && (
        <div className="min-w-0">
          <p className="label-os">cerebro</p>
          <p className="mt-0.5 font-mono text-2xl font-medium tabular-nums">
            {now ? now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
            <span className="ml-3 align-middle font-sans text-sm font-normal capitalize text-muted-foreground">
              {now ? now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" }) : ""}
            </span>
          </p>
        </div>
      )}
      <StatusControls />
    </header>
  );
}

const left = [
  { to: "/", label: "Hoy", icon: Sun },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
] as const;
const right = [
  { to: "/tareas", label: "Tareas", icon: CheckSquare },
  { to: "/casa", label: "Ocio", icon: RemoteIcon },
] as const;
const more = [
  { to: "/areas", label: "Áreas", icon: Shapes },
  { to: "/biblioteca", label: "Biblioteca", icon: Library },
  { to: "/sistema", label: "Sistema", icon: Server },
] as const;

type IconT = (p: { className?: string; strokeWidth?: number }) => ReactNode;

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: IconT }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="flex min-h-[56px] min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl px-3 text-muted-foreground transition-colors active:bg-accent"
      activeProps={{ className: "!text-foreground bg-accent" }}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

function BottomNav() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  return (
    <nav className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-fit items-center gap-1 rounded-[28px] glass bg-glass-strong p-1.5">
      {left.map((i) => <NavItem key={i.to} {...i} />)}
      <button onClick={toggleDonna} aria-label="Hablar con Donna" className="mx-2 grid h-16 w-16 place-items-center rounded-full active:scale-95">
        <span className="h-14 w-14 rounded-full bg-orb animate-orb" />
      </button>
      {right.map((i) => <NavItem key={i.to} {...i} />)}
      <div className="relative">
        <button onClick={() => setOpen((o) => !o)} aria-label="Más secciones" aria-expanded={open} className="flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl text-muted-foreground active:bg-accent">
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
          <span className="text-[11px] font-medium">Más</span>
        </button>
        {open && (
          <div className="absolute bottom-[72px] right-0 w-48 rounded-3xl glass bg-glass-strong p-2">
            {more.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm active:bg-accent" activeProps={{ className: "bg-accent" }}>
                <Icon className="h-4 w-4 text-muted-foreground" /> {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/focus")) return <>{children}</>;
  return (
    <div className="min-h-screen pb-28">
      <Header home={path === "/"} />
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
