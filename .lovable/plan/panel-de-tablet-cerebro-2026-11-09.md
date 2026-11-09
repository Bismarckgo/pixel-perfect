# Panel de tablet — Cerebro

## Comprensión del documento

| Petición | Qué entendí | Cambio concreto |
|---|---|---|
| Respetar el estilo fijado | Refinar Cerebro, no sustituir su identidad | Conservar la paleta y las áreas actuales; superficies sin desenfoques |
| Hoy mínimo y táctil | Saludo lateral, clima, calendario, tres tareas y foco | Reorganizar en horizontal y apilar en vertical, sin encoger textos |
| Servidor y avisos | Solo información comprobada | Cinco indicadores con «—», acceso a Sistema y lista de avisos reales locales |
| Foco/Pomodoro | Empezar con un toque, 25 o 50 minutos | Selección de tarea pendiente, pantalla dedicada sin barra y cuenta inmediata |
| Calendario | Semana, Mes y Hoy con tareas fechadas | Una agenda compartida, detalles y acciones según tipo y estado |
| Tareas | Caja sin asignar y tres columnas | Crear con área y fecha opcional; hoja inferior para asignar con dos toques |
| Donna | Entrada breve, no chat completo | Un toque, campo enfocado si no hay dictado local disponible; recibo y Deshacer |
| Ocio | Dos equipos y escenas desconectados | Controles grandes desactivados, sin simular encendido ni cambios |
| PWA y rendimiento | Instalación, carcasa sin conexión, comprobaciones honestas | Manifest, caché acotada de producción y mediciones con límites documentados |

## Supuestos y contradicciones resueltas

- **[SUPUESTO]** La prioridad «respetar el estilo ya fijado» prevalece sobre las asignaciones provisionales del documento: se mantienen Manrope/JetBrains Mono, Donna naranja y los colores/áreas existentes. No se introduce morado ni se renombran proyectos. No se recibió el diseño de Illustrator mencionado.
- **[SUPUESTO]** Se mantiene visible «Demo» para los ejemplos: ocultarlo contradice la regla vigente de distinguir datos reales. Los datos personales existentes se conservan al adaptar el almacenamiento.
- **[SUPUESTO]** El tema automático actual y su cambio manual se conservan; no se decide una nueva ventana de sueño.
- **[SUPUESTO]** Áreas y Biblioteca permanecen en sus propias pantallas y conservan un acceso secundario; no se eliminan para reducir la barra.
- **[SUPUESTO]** No se activa nube ni sincronización. La persistencia del Pomodoro será local y el adaptador de servidor quedará explícitamente «No conectado». No se promete guardado remoto sin servidor real.
- **[SUPUESTO]** Se permite ahora carcasa sin conexión porque este documento la solicita explícitamente. Solo caché de archivos públicos de producción, nunca datos personales, peticiones autenticadas ni respuestas dinámicas. No registrar caché en la vista de desarrollo para evitar pantallas antiguas.
- **[SUPUESTO]** No enviar voz a los servicios de reconocimiento de Chrome: eso puede sacar datos personales del servidor. Usar reconocimiento local únicamente cuando el navegador lo garantice; de lo contrario, entrada de texto. El dictado del teclado depende del teclado configurado por el usuario y no puede garantizarse privado desde Cerebro.
- **[SUPUESTO]** Wake Lock solo durante una sesión activa. Pantalla completa, sonido y vibración se intentan donde sean compatibles; el Pomodoro cubre la ventana aunque el navegador deniegue pantalla completa.
- **Limitación conocida:** la pila React/TanStack/Tailwind se mantiene. Tailwind v4 requiere Chrome 111 como mínimo; no afirmar compatibilidad con Chrome 100. Se evitarán nuevas APIs sin alternativa y se documentará el navegador mínimo real.
- **Limitación conocida:** modelo, RAM, versión de Android/Chrome y diseño original no están verificados. No puedo probar en tu tablet física ni en un iPad real desde aquí.

## Composición antes del código

### Horizontal — referencia 1280 × 800

````text
┌──────────────────────────────────────────────────────────────┐
│                           Servidor CPU Disco RAM Temp  Avisos│
│                           —        —   —     —   —           │
├───────────────────┬──────────────────────────────────────────┤
│ Saludo, Bismarck  │ CALENDARIO                    Semana / Mes│
│ Fecha completa   │ Lu    Ma    Mi    Ju    Vi    Sá    Do     │
│ Hora             │ Fechas y bloques con iconos de área       │
│ Clima            ├───────────────────────────────────────────┤
│                  │ TAREAS     (anillo %)                      │
│ FOCO AHORA       │ N cosas en tu radar                        │
│ Área · tarea     │ [ ] Primera tarea                          │
│ [Empezar]        │ [ ] Segunda tarea                          │
│ [25 / 50 min]    │ [✓] Tercera tarea                          │
│ N pomodoros hoy  │                                            │
├──────────────────┴───────────────────────────────────────────┤
│        Hoy     Calendario     DONNA     Tareas     Ocio       │
└──────────────────────────────────────────────────────────────┘
````

### Vertical — referencia 800 × 1280

````text
┌─────────────────────────────────────┐
│ Servidor CPU Disco RAM Temp   Avisos│
│ —        —   —     —   —            │
├─────────────────────────────────────┤
│ Saludo, Bismarck                     │
│ Fecha · hora                        │
│ Clima                               │
├─────────────────────────────────────┤
│ FOCO AHORA · área                   │
│ Tarea                               │
│ [Empezar]       [25 / 50 min]        │
│ N pomodoros hoy                     │
├─────────────────────────────────────┤
│ CALENDARIO             Semana / Mes │
│ Siete días · bloques                │
├─────────────────────────────────────┤
│ TAREAS · anillo · N en tu radar      │
│ [ ] Tarea   [ ] Tarea   [✓] Tarea    │
├─────────────────────────────────────┤
│ Hoy  Calendario  DONNA  Tareas  Ocio │
└─────────────────────────────────────┘
````

En ambas orientaciones habrá márgenes seguros, objetivos táctiles de al menos 48 px, controles del Pomodoro de al menos 56 px y espacio reservado para que Donna no tape contenido. Se admite desplazamiento vertical antes que texto diminuto.

## Implementación por entregas

1. **Datos compartidos y tareas:** adaptar el estado existente sin perder tareas/Inbox, añadir sin asignar y fechas opcionales; mantener muestras centralizadas y colores únicos. Integrar caja, creación y hoja de asignación.
2. **Calendario y Hoy:** implementar las tres vistas y reutilizar los mismos bloques/detalles en Hoy. Añadir sensación térmica real al clima, reloj y foco seleccionable; conservar datos desconectados honestos.
3. **Pomodoro:** estado único serializable, tiempo por fecha de fin, recarga/pausa/continuación correctas. Inicio mueve la tarea a En proceso; completarlo no la marca hecha. Cancelar pide confirmación y no cuenta. Finalización idempotente: contador por día y registro local verificado una sola vez, sonido/vibración y botones Otra sesión/Volver a Hoy.
4. **Donna y Ocio:** reemplazar chat por entrada breve y recibos con Deshacer. Reconocer comando de Pomodoro por texto y, solo si existe reconocimiento local seguro, voz. Ocio conserva equipos desconectados y añade exclusivamente los controles/escenas descritos, desactivados.
5. **Instalación y comprobaciones:** ajustar manifest a fullscreen con alternativa standalone, orientación libre e icono maskable adecuado. Caché pública de producción versionada, sin interceptar datos del servidor; actualizar instrucciones de instalación, pantalla encendida y limitaciones.

## Detalles técnicos

- Mantener rutas TanStack existentes y metadatos propios en cada pantalla; no cambiar de framework ni modificar archivos generados.
- Repositorio local compartido con adaptador explícito para una conexión futura; nada de llamadas remotas simuladas.
- Módulo de lógica pura para Pomodoro separado de APIs del navegador; almacenamiento leído después de hidratar y tolerancia a errores de almacenamiento.
- Fullscreen solicitado directamente desde el gesto de Empezar, antes de navegar. Wake Lock solicitado de nuevo al recuperar visibilidad; liberado al salir de la sesión activa.
- Separar cuenta por día e historial de la tarea, con protección frente a recarga y doble finalización. Dejar el modelo preparado, no implementar control desde PC.
- Eliminar desenfoques y sombras animadas; solo transform/opacity para animaciones continuas del orbe, pausadas al ocultar la página y respetando movimiento reducido. El anillo refleja progreso sin animación pesada.
- Medir archivos de producción disponibles sin prometer el límite de 200 KB. Si el framework impide cumplirlo, indicarlo con cifras en lugar de cambiar la pila o fingir un resultado.
- Comprobar compatibilidad de las APIs y CSS usados con herramientas estáticas apropiadas; documentar diferencias entre el objetivo Chrome 100 y el mínimo exigido por Tailwind.
- Registrar decisiones estructurales en AGENTS.md y actualizar el roadmap por entrega.

## Pruebas y evidencia de entrega

- Tests concretos: 25/50 minutos, avance a En proceso, cancelación no cuenta, finalización no completa tarea, contador e historial una sola vez, fechas compartidas, asignación de columna, marcar/desmarcar y Deshacer.
- Navegador: crear una tarea con fecha, asignarla, verla en Calendario y Hoy, completar y leer el resultado en Completadas; iniciar Pomodoro, pausar, continuar, recargar, cancelar y finalizar una sesión con reloj controlado.
- Verificar 1280 × 800, 800 × 1280, 1920 × 1200 e iPad horizontal 1133 × 744; texto legible, objetivos táctiles y ausencia de solapamientos. Contar nodos de Hoy y revisar errores.
- Autoevaluación de las 25 filas del documento con Sí/No/No verificado y evidencia real. La tablet física, apagado real de pantalla, instalación física, voz local, batería y fluidez en 2 GB seguirán sin verificar salvo prueba real posterior.
- La entrega incluirá instrucciones y relación de archivos cambiados; el código completo queda en el proyecto sincronizado con GitHub, sin pegar miles de líneas en el chat por defecto.

**Resultado esperado:** panel mínimo con Pomodoro fiable localmente, pantallas vinculadas por el mismo estado y ninguna capacidad remota presentada como existente.