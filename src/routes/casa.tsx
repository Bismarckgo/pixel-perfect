import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/cerebro/AppShell";

export const Route = createFileRoute("/casa")({
  head: () => ({
    meta: [
      { title: "Casa — Cerebro" },
      { name: "description", content: "Apple TV 4K y PC Lenovo. Aparecerán como “No conectado” hasta tener integraciones reales." },
      { property: "og:title", content: "Casa — Cerebro" },
      { property: "og:description", content: "Apple TV 4K y PC Lenovo. Aparecerán como “No conectado” hasta tener integraciones reales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Placeholder label="casa" title="Casa" text="Apple TV 4K y PC Lenovo. Aparecerán como “No conectado” hasta tener integraciones reales." />,
});
