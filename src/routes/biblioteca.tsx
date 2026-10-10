import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Inbox, Lightbulb, BookOpen, Folder, Trash2 } from "lucide-react";
import { useCerebro, removeIdea } from "@/lib/cerebro-store";
import { demoIdeas, demoKnowledge, demoFiles } from "@/lib/demo-data";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca — Cerebro" },
      { name: "description", content: "Inbox, Ideas, Conocimiento y Archivos en un solo lugar, con filtros." },
      { property: "og:title", content: "Biblioteca — Cerebro" },
      { property: "og:description", content: "Inbox, Ideas, Conocimiento y Archivos en un solo lugar, con filtros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Biblioteca,
});

const Demo = () => (
  <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">demo</span>
);

type Tab = "inbox" | "ideas" | "conocimiento" | "archivos";
const tabs: { id: Tab; label: string; icon: typeof Inbox }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "ideas", label: "Ideas", icon: Lightbulb },
  { id: "conocimiento", label: "Conocimiento", icon: BookOpen },
  { id: "archivos", label: "Archivos", icon: Folder },
];

function timeAgo(at: number) {
  const min = Math.round((Date.now() - at) / 60_000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} días`;
}

function Biblioteca() {
  const { inbox } = useCerebro();
  const [tab, setTab] = useState<Tab>("inbox");
  const [area, setArea] = useState("Todas");

  const areas = useMemo(() => {
    const set = new Set<string>();
    demoIdeas.forEach((i) => set.add(i.area));
    demoKnowledge.forEach((k) => set.add(k.area));
    demoFiles.forEach((f) => set.add(f.area));
    return ["Todas", ...set];
  }, []);

  const byArea = <T extends { area: string }>(items: T[]) =>
    area === "Todas" ? items : items.filter((i) => i.area === area);

  return (
    <main className="mx-auto max-w-4xl px-6 pt-10">
      <p className="label-os">biblioteca</p>
      <h1 className="mt-2 text-4xl font-semibold">Biblioteca</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Tu memoria externa: lo que capturas, lo que se te ocurre, lo que sabes y tus archivos. El Inbox es real; lo demás está etiquetado.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm ${tab === id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
            {id === "inbox" && inbox.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] text-primary-foreground">{inbox.length}</span>
            )}
          </button>
        ))}
        {tab !== "inbox" && (
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="ml-auto h-11 rounded-full border bg-card px-4 text-sm outline-none"
            aria-label="Filtrar por área"
          >
            {areas.map((a) => <option key={a}>{a}</option>)}
          </select>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {tab === "inbox" && (
          inbox.length === 0 ? (
            <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
              <p>Inbox vacío. Usa la captura rápida de arriba o dile algo a Donna.</p>
            </div>
          ) : (
            inbox.map((i) => (
              <div key={i.id} className="flex items-center gap-4 rounded-3xl surface p-4">
                <Inbox className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="min-w-0 flex-1 truncate text-sm">{i.text}</p>
                <span className="font-mono text-xs text-muted-foreground">{timeAgo(i.at)}</span>
                <button
                  onClick={() => removeIdea(i.id)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                  aria-label={`Eliminar “${i.text}”`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )
        )}

        {tab === "ideas" && byArea(demoIdeas).map((i) => (
          <div key={i.id} className="flex items-center gap-4 rounded-3xl surface p-4">
            <Lightbulb className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="min-w-0 flex-1 text-sm">{i.text}</p>
            <span className="label-os">{i.area}</span>
            <span className="font-mono text-xs text-muted-foreground">{i.at}</span>
            <Demo />
          </div>
        ))}

        {tab === "conocimiento" && byArea(demoKnowledge).map((k) => (
          <div key={k.id} className="flex items-center gap-4 rounded-3xl surface p-4">
            <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{k.title}</p>
              <p className="text-xs text-muted-foreground">{k.source}</p>
            </div>
            <span className="label-os">{k.area}</span>
            <Demo />
          </div>
        ))}

        {tab === "archivos" && (
          <>
            <div className="rounded-3xl border border-dashed p-4 text-sm text-muted-foreground">
              Archivos reales: no conectado. Cuando Cerebro viva en tu servidor, aquí verás tus archivos de verdad.
            </div>
            {byArea(demoFiles).map((f) => (
              <div key={f.id} className="flex items-center gap-4 rounded-3xl surface p-4">
                <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="min-w-0 flex-1 truncate font-mono text-sm">{f.name}</p>
                <span className="label-os">{f.kind}</span>
                <span className="label-os">{f.area}</span>
                <Demo />
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
