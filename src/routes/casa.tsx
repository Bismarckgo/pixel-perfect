import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, Monitor, Play, Power, Tv, Volume2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  component: Casa,
});

function ConnectionStatus() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <WifiOff className="h-4 w-4" strokeWidth={1.75} />
      No conectado
    </span>
  );
}

function ConnectionDetails({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 border-t pt-2">
      <Button
        variant="ghost"
        className="h-11 w-full justify-between px-0 hover:bg-transparent"
        aria-expanded={open}
        aria-controls={`${id}-connection`}
        onClick={() => setOpen((value) => !value)}
      >
        Conexión
        {open ? <ChevronUp /> : <ChevronDown />}
      </Button>
      {open && (
        <dl id={`${id}-connection`} className="mt-2 space-y-3 pb-3 text-sm">
          <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">Integración</dt><dd>No conectado</dd></div>
          <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">Pantalla y cable</dt><dd>Por confirmar</dd></div>
          <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">Última conexión</dt><dd>Sin registro</dd></div>
        </dl>
      )}
    </div>
  );
}

function Casa() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-os">casa</p>
          <h1 className="mt-2 text-4xl font-semibold">Casa</h1>
        </div>
        <p className="text-sm text-muted-foreground">Sin integraciones conectadas</p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1.35fr_1fr] md:gap-12">
        <section aria-labelledby="apple-tv-title" className="min-w-0">
          <div className="flex items-center gap-3 border-b pb-4">
            <Tv className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
            <span className="label-os">01 / entretenimiento</span>
          </div>
          <div className="flex h-36 items-center justify-center text-muted-foreground md:h-40">
            <svg viewBox="0 0 320 150" className="h-full w-full max-w-xs" role="img" aria-label="Ilustración de Apple TV y mando">
              <rect x="55" y="45" width="150" height="75" rx="20" fill="var(--card)" stroke="currentColor" strokeWidth="1.5" />
              <path d="M55 99c0 12 8 21 20 21h110c12 0 20-9 20-21" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="130" y="86" textAnchor="middle" fill="currentColor" fontFamily="var(--font-sans)" fontSize="18">tv</text>
              <rect x="240" y="15" width="35" height="120" rx="12" fill="var(--secondary)" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="257.5" cy="42" r="11" fill="none" stroke="currentColor" />
              <circle cx="257.5" cy="42" r="4" fill="currentColor" />
              <circle cx="250" cy="68" r="3" fill="currentColor" /><circle cx="265" cy="68" r="3" fill="currentColor" />
              <path d="M250 84h15m-7.5 9v19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="apple-tv-title" className="text-2xl font-semibold">Apple TV 4K</h2>
            <ConnectionStatus />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Reproducción actual: no disponible</p>
          <div role="group" aria-label="Controles de Apple TV" className="mt-5 flex gap-3">
            <Button disabled variant="outline" size="icon" className="h-11 w-11 rounded-full" aria-label="Encender Apple TV" title="Encender · No conectado"><Power /></Button>
            <Button disabled variant="outline" size="icon" className="h-11 w-11 rounded-full" aria-label="Reproducir en Apple TV" title="Reproducir · No conectado"><Play /></Button>
            <Button disabled variant="outline" size="icon" className="h-11 w-11 rounded-full" aria-label="Volumen de Apple TV" title="Volumen · No conectado"><Volume2 /></Button>
          </div>
          <ConnectionDetails id="apple-tv" />
        </section>

        <section aria-labelledby="lenovo-title" className="min-w-0">
          <div className="flex items-center gap-3 border-b pb-4">
            <Monitor className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
            <span className="label-os">02 / equipo</span>
          </div>
          <div className="flex h-36 items-center justify-center text-muted-foreground md:h-40">
            <Monitor className="h-24 w-32" strokeWidth={0.75} aria-hidden="true" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="lenovo-title" className="text-2xl font-semibold">PC Lenovo</h2>
            <ConnectionStatus />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Actividad actual: no disponible</p>
          <div role="group" aria-label="Controles de PC Lenovo" className="mt-5 flex gap-3">
            <Button disabled variant="outline" size="icon" className="h-11 w-11 rounded-full" aria-label="Encender PC Lenovo" title="Encender · No conectado"><Power /></Button>
          </div>
          <ConnectionDetails id="lenovo" />
        </section>
      </div>
    </main>
  );
}
