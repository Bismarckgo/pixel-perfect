import { createFileRoute } from "@tanstack/react-router";
import { AgendaPanel } from "@/components/cerebro/AgendaPanel";

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

function Calendario() { return <main className="tablet-page"><h1 className="mb-6 text-3xl font-semibold">Calendario</h1><AgendaPanel /></main>; }
