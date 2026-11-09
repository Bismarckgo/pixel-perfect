import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, type SVGProps } from "react";
import { Sun, CalendarDays, CheckSquare, Shapes, Moon, SunMoon, Library, Server, Bell, MoreHorizontal, Cpu, HardDrive, MemoryStick, Thermometer } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { useTimer, tickTimer } from "@/lib/timer-store";
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
 const { theme, mode, cycle } = useTheme(); const [open, setOpen] = useState(false); const timer = useTimer();
 const ThemeIcon = mode === "auto" ? SunMoon : theme === "light" ? Sun : Moon;
 return <div className="status-controls"><Link to="/sistema" className="server-indicators" aria-label="Servidor: No conectado. Abrir detalle">{[{ icon: Server, label: "Servidor" }, { icon: Cpu, label: "CPU" }, { icon: HardDrive, label: "Disco" }, { icon: MemoryStick, label: "RAM" }, { icon: Thermometer, label: "Temp." }].map(({ icon: Icon, label }) => <span key={label} className="flex flex-col items-center gap-1"><Icon size={20} strokeWidth={1.7} /><span className="text-[13px]">—</span><span className="sr-only">{label}</span></span>)}</Link><Button onClick={() => setOpen((o) => !o)} aria-label="Notificaciones" aria-expanded={open} className="rounded-full"><Bell />{timer.history.length > 0 && <span>{timer.history.length}</span>}</Button><Button variant="ghost" size="icon" onClick={cycle} aria-label="Cambiar tema"><ThemeIcon /></Button>{open && <div className="notifications-panel"><h2 className="label-os">Avisos · Historial de Donna</h2>{timer.history.length ? <ul className="mt-4 space-y-4">{timer.history.map((r) => <li key={r.id}><p>{r.text}</p><p className="mt-1 text-[13px] text-muted-foreground">{new Date(r.at).toLocaleString("es")} · Verificado localmente</p></li>)}</ul> : <p className="mt-4 text-muted-foreground">Sin notificaciones</p>}</div>}</div>;
}

function Header({ home }: { home: boolean }) {
  const now = useNow();
  return (
    <header className="flex items-center gap-4 px-8 py-4">
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
      activeProps={{ className: "nav-active text-foreground" }}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-[13px] font-medium">{label}</span>
    </Link>
  );
}

function BottomNav() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  return (
    <nav className="bottom-nav">
      {left.map((i) => <NavItem key={i.to} {...i} />)}
      <Button variant="ghost" onClick={toggleDonna} aria-label="Hablar con Donna" className="donna-orb-button">
        <span className="h-16 w-16 rounded-full bg-orb animate-orb" />
      </Button>
      {right.map((i) => <NavItem key={i.to} {...i} />)}
      <div className="relative">
        <Button variant="ghost" onClick={() => setOpen((o) => !o)} aria-label="Más secciones" aria-expanded={open} className="flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl text-muted-foreground active:bg-accent">
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
          <span className="text-[13px] font-medium">Más</span>
        </Button>
        {open && (
          <div className="absolute bottom-[72px] right-0 w-48 rounded-3xl bg-popover border p-2">
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
  useEffect(() => { const tick = () => { tickTimer(); document.documentElement.classList.toggle("page-hidden", document.hidden); }; tick(); const id = setInterval(tick, 1000); document.addEventListener("visibilitychange", tick); return () => { clearInterval(id); document.removeEventListener("visibilitychange", tick); }; }, []);
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
