import { Music, Hexagon, Megaphone, Brain, Heart, Server, Camera, Inbox, type LucideIcon } from "lucide-react";

/** Paleta fija por área: el mismo color e icono en Hoy, Calendario, Tareas y Kanban. */
export type AreaStyle = { color: string; icon: LucideIcon };

const areas: Record<string, AreaStyle> = {
  "Música": { color: "var(--area-musica)", icon: Music },
  CST: { color: "var(--area-cst)", icon: Hexagon },
  "W Agency Ads": { color: "var(--area-waa)", icon: Megaphone },
  Cerebro: { color: "var(--area-cerebro)", icon: Brain },
  Personal: { color: "var(--area-personal)", icon: Heart },
  Sistema: { color: "var(--area-sistema)", icon: Server },
  "Fotografía analógica": { color: "var(--area-foto)", icon: Camera },
};
const fallback: AreaStyle = { color: "var(--area-sistema)", icon: Inbox };

export function areaStyle(name: string): AreaStyle {
  return areas[name] ?? fallback;
}
