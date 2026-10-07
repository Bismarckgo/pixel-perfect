import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/cerebro/AppShell";

export const Route = createFileRoute("/sistema")({
  head: () => ({
    meta: [
      { title: "Sistema — Cerebro" },
      { name: "description", content: "Estado real del servidor, accesos Tailscale/Debian, registro de Donna y ajustes. Servidor: no conectado." },
      { property: "og:title", content: "Sistema — Cerebro" },
      { property: "og:description", content: "Estado real del servidor, accesos Tailscale/Debian, registro de Donna y ajustes. Servidor: no conectado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Placeholder label="sistema" title="Sistema" text="Estado real del servidor, accesos Tailscale/Debian, registro de Donna y ajustes. Servidor: no conectado." />,
});
