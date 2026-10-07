import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/cerebro/AppShell";

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
  component: () => <Placeholder label="biblioteca" title="Biblioteca" text="Inbox, Ideas, Conocimiento y Archivos en un solo lugar, con filtros." />,
});
