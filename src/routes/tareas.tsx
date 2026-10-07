import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/cerebro/AppShell";

export const Route = createFileRoute("/tareas")({
  head: () => ({
    meta: [
      { title: "Tareas — Cerebro" },
      { name: "description", content: "Tablero Por hacer / Haciendo / Esperando / Hecho, con filtro por área." },
      { property: "og:title", content: "Tareas — Cerebro" },
      { property: "og:description", content: "Tablero Por hacer / Haciendo / Esperando / Hecho, con filtro por área." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Placeholder label="tareas" title="Tareas" text="Tablero Por hacer / Haciendo / Esperando / Hecho, con filtro por área." />,
});
