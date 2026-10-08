import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { demoEvents } from "@/lib/demo-data";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendario — Cerebro" },
      { name: "description", content: "Mes con números grandes y la agenda del día. Se llenará con lo que Donna capture." },
      { property: "og:title", content: "Calendario — Cerebro" },
      { property: "og:description", content: "Mes con números grandes y la agenda del día. Se llenará con lo que Donna capture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Calendario,
});

function Calendario() {
  const today = new Date();
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today.getDate());

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isThisMonth = year === today.getFullYear() && month === today.getMonth();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthName = view.toLocaleDateString("es", { month: "long", year: "numeric" });
  const selectedLabel = new Date(year, month, selected).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
  const hasEvents = isThisMonth && selected === today.getDate();

  return (
    <main className="mx-auto max-w-[1180px] px-6 pt-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <div className="flex items-center gap-2"><p className="label-os">calendario</p><span className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">demo</span></div>
          <h1 className="mt-1 text-3xl font-semibold capitalize">{monthName}</h1>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setView(new Date(year, month - 1, 1))} aria-label="Mes anterior" className="grid h-11 w-11 place-items-center rounded-full border"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => { setView(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today.getDate()); }} className="min-h-11 rounded-full border px-4 text-sm">Hoy</button>
          <button onClick={() => setView(new Date(year, month + 1, 1))} aria-label="Mes siguiente" className="grid h-11 w-11 place-items-center rounded-full border"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="surface rounded-3xl p-4">
          <div className="grid grid-cols-7 gap-1">
            {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
              <p key={d} className="label-os py-2 text-center">{d}</p>
            ))}
            {cells.map((d, i) => {
              const isToday = isThisMonth && d === today.getDate();
              const isSel = d === selected;
              return (
                <button
                  key={i}
                  disabled={d === null}
                  onClick={() => d && setSelected(d)}
                  className={`flex min-h-14 items-center justify-center rounded-2xl text-xl font-medium tabular-nums transition-colors ${
                    d === null ? "" : isSel ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                  } ${isToday && !isSel ? "text-primary" : ""}`}
                >
                  {d}
                  {isToday && <span className="sr-only">(hoy)</span>}
                </button>
              );
            })}
          </div>
        </section>

        <aside className="rounded-3xl border p-5">
          <p className="label-os">agenda</p>
          <h2 className="mt-1 text-lg font-semibold capitalize">{selectedLabel}</h2>
          {hasEvents ? (
            <ul className="mt-4 space-y-3">
              {demoEvents.map((e) => (
                <li key={e.time} className="flex items-baseline gap-3 rounded-2xl border bg-card/50 p-3">
                  <span className="font-mono text-sm tabular-nums text-primary">{e.time}</span>
                  <div>
                    <p className="text-sm leading-snug">{e.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{e.area}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Nada apuntado. Cuando Donna capture algo con fecha, aparecerá aquí.</p>
          )}
          <p className="label-os mt-6">se llena con lo que donna capture</p>
        </aside>
      </div>
    </main>
  );
}
