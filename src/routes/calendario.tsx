import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/cerebro/AppShell";

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
  component: () => <Placeholder label="calendario" title="Calendario" text="Mes con números grandes y la agenda del día. Se llenará con lo que Donna capture." />,
});
