import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Circle, Pause, ChevronDown } from "lucide-react";
import { demoAreas, type Area } from "@/lib/demo-data";
import { toggleDonna } from "@/components/cerebro/Donna";

export const Route = createFileRoute("/areas")({
  head: () => ({
    meta: [
      { title: "Áreas — Cerebro" },
      { name: "description", content: "Tus proyectos reales con hitos, ritmo semanal y un estante de “en pausa”." },
      { property: "og:title", content: "Áreas — Cerebro" },
      { property: "og:description", content: "Tus proyectos reales con hitos, ritmo semanal y un estante de “en pausa”." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Areas,
});

const Demo = () => (
  <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">demo</span>
);

function AreaCard({ area }: { area: Area }) {
  const [open, setOpen] = useState(false);
  const milestones = area.milestones;
  const undefinedMilestones = milestones === null;

  return (
    <section className="rounded-3xl surface p-5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 text-left" aria-expanded={open}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{area.name}</h2>
            {area.paused && (
              <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <Pause className="h-3 w-3" /> en pausa
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{area.focus}</p>
        </div>
        <span className="hidden font-mono text-xs text-muted-foreground sm:block">{area.rhythm}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-4 border-t pt-4">
          <p className="label-os">hitos</p>
          {undefinedMilestones ? (
            <div className="mt-3 rounded-2xl border border-dashed p-4">
              <p className="text-sm text-sand">Hitos sin definir.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No voy a inventarlos. Dile a Donna cuál sería el primer entregable visible de {area.name} y lo anota aquí.
              </p>
              <button onClick={toggleDonna} className="mt-3 min-h-11 rounded-full border px-4 text-sm hover:bg-accent">
                Definir con Donna
              </button>
            </div>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {area.milestones.map((m) => (
                <li key={m.title} className="flex items-center gap-3 text-sm">
                  {m.done ? (
                    <Check className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={m.done ? "text-muted-foreground line-through" : ""}>{m.title}</span>
                  {m.date && <span className="ml-auto font-mono text-xs text-muted-foreground">{m.date}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function Areas() {
  const active = demoAreas.filter((a) => !a.paused);
  const paused = demoAreas.filter((a) => a.paused);

  return (
    <main className="mx-auto max-w-4xl px-6 pt-10">
      <div className="flex items-center gap-3">
        <p className="label-os">areas</p>
        <Demo />
      </div>
      <h1 className="mt-2 text-4xl font-semibold">Áreas</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Tus proyectos reales, uno por uno. Toca un área para ver sus hitos. Lo que no tiene hitos definidos se dice claro, sin rellenar.
      </p>

      <div className="mt-8 space-y-4">
        {active.map((a) => (
          <AreaCard key={a.id} area={a} />
        ))}
      </div>

      {paused.length > 0 && (
        <>
          <p className="label-os mt-10">estante · en pausa</p>
          <div className="mt-4 space-y-4 opacity-70">
            {paused.map((a) => (
              <AreaCard key={a.id} area={a} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
