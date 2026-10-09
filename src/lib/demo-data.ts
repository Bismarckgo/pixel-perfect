/**
 * ÚNICO archivo de datos de muestra. Todo lo que sale de aquí se etiqueta "Demo" en la UI.
 * Cuando haya integraciones reales, src/lib/data.ts dejará de leer de aquí.
 */
export type DemoEvent = { time: string; title: string; area: string };
export type DemoTask = { title: string; area: string };
export type Receipt = { status: "ok" | "warn" | "fail"; text: string; at: string };
export type Goal = { name: string; progress: number | null; note: string };

export const demoEvents: DemoEvent[] = [
  { time: "16:30", title: "Revisar pendientes con Donna", area: "Sistema" },
  { time: "17:15", title: "Sesión de mezcla — voces", area: "Música" },
  { time: "19:00", title: "Tiempo en pareja", area: "Personal" },
];

export const demoFocusTasks: DemoTask[] = [
  { title: "Terminar mezcla de “Chicas malas”", area: "Música" },
  { title: "Definir hitos de CST", area: "CST" },
  { title: "Bocetar 3 posts de W Agency Ads", area: "W Agency Ads" },
];

export const demoReceipts: Receipt[] = [
  { status: "ok", text: "Guardé 2 ideas en tu Inbox", at: "16:05" },
  { status: "warn", text: "“Llamar al estudio” — fecha por confirmar", at: "16:12" },
  { status: "fail", text: "No pude abrir el calendario: no conectado", at: "16:20" },
];

export const demoGoals: Goal[] = [
  { name: "Cerebro", progress: 0.35, note: "Rediseño en curso" },
  { name: "CST", progress: null, note: "Define los hitos" },
  { name: "W Agency Ads", progress: null, note: "Define los hitos" },
];

export type BoardColumn = "todo" | "doing" | "waiting" | "done";
export type BoardTask = { id: string; title: string; area: string; col: BoardColumn; note?: string };

export type Milestone = { title: string; done: boolean; date?: string };
export type Area = {
  id: string;
  name: string;
  focus: string;
  rhythm: string;
  milestones: Milestone[] | null; // null = hitos sin definir
  paused?: boolean;
};

export const demoAreas: Area[] = [
  {
    id: "musica",
    name: "Música",
    focus: "Terminar mezcla de “Chicas malas”",
    rhythm: "3 sesiones por semana",
    milestones: [
      { title: "Mezcla de “Chicas malas”", done: false, date: "esta semana" },
      { title: "Master y portada", done: false, date: "por confirmar" },
      { title: "Lanzamiento del single", done: false, date: "por confirmar" },
    ],
  },
  {
    id: "cerebro",
    name: "Cerebro",
    focus: "Rediseño de la interfaz",
    rhythm: "iteración diaria",
    milestones: [
      { title: "Sistema de diseño y navegación", done: true },
      { title: "Hoy, Tareas y Calendario", done: true },
      { title: "Áreas, Biblioteca, Casa y Sistema", done: false, date: "en curso" },
    ],
  },
  { id: "cst", name: "CST", focus: "Por definir", rhythm: "sin ritmo definido", milestones: null },
  { id: "waa", name: "W Agency Ads", focus: "Por definir", rhythm: "sin ritmo definido", milestones: null },
  { id: "fotografia", name: "Fotografía analógica", focus: "En pausa", rhythm: "—", milestones: null, paused: true },
];

export const demoBoard: BoardTask[] = [
  { id: "d1", title: "Terminar mezcla de “Chicas malas”", area: "Música", col: "doing" },
  { id: "d2", title: "Definir hitos de CST", area: "CST", col: "todo" },
  { id: "d3", title: "Bocetar 3 posts de W Agency Ads", area: "W Agency Ads", col: "todo" },
  { id: "d4", title: "Investigar YOLO", area: "Cerebro", col: "todo" },
  { id: "d5", title: "Respuesta del estudio", area: "Música", col: "waiting", note: "fecha por confirmar" },
  { id: "d6", title: "Nueva barra de navegación", area: "Cerebro", col: "done" },
];
