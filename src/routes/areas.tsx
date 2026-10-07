import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/cerebro/AppShell";

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
  component: () => <Placeholder label="areas" title="Áreas" text="Tus proyectos reales con hitos, ritmo semanal y un estante de “en pausa”." />,
});
