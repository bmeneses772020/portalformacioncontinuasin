# Cursos Educación Continua

Página-ruta para los talleres de formación continua: reúne tus tres cursos de autogestión y **los desbloquea en orden** (APA 7 → Expresión Escrita y Comprensión Lectora → Metodología de la Investigación). No cobra nada: cada curso se abre desde aquí con un **código de acceso** que tú entregas a los participantes.

## Cómo funciona

1. Desde esta página, cada participante pulsa «Entrar al curso». Se abre el curso con la dirección `…?ec=1`, que activa el **modo Educación Continua**: sin precio ni QR de pago, solo la pantalla de código de acceso.
2. Al terminar el 100 % de las lecciones, el curso muestra el botón «Volver y desbloquear el siguiente», que regresa a esta página con una marca de finalización.
3. Esta página valida la marca, guarda el avance **en el navegador** y desbloquea el siguiente curso.

## Códigos de acceso para los talleres

Cada curso acepta, además de su código de venta, un código propio para Educación Continua (se cambian en `src/Gate.jsx` de cada curso, lista `VALID_CODES`):

| Curso | Código |
| --- | --- |
| APA 7 | `EDUCON-APA7` |
| Expresión Escrita y Comprensión Lectora | `EDUCON-REDACCION` |
| Metodología de la Investigación | `EDUCON-METODOLOGIA` |

## Importante

- **Es un candado simple, no seguridad bancaria.** El código y la marca de finalización están del lado del navegador: sirven para ordenar la ruta, y una persona con conocimientos técnicos podría saltárselos. Para un taller con docentes es suficiente.
- El avance se guarda **por navegador**. En un laboratorio compartido, el botón «Reiniciar mi progreso» deja el equipo listo para otra persona.
- La dirección de esta página debe ser `https://cursoseducacioncontinua.vercel.app/` (nombre del proyecto en Vercel: `cursoseducacioncontinua`), porque los cursos regresan a esa dirección. Si usas otra, cámbiala en `HUB_URL` del archivo `src/ec.js` de cada curso.
- Si cambias el orden o agregas cursos, edita `COURSES` en `src/App.jsx`. El texto `SALT` debe ser idéntico al de `src/ec.js` en los cursos.

## Cómo publicarla

1. Sube el contenido de esta carpeta a un repositorio nuevo de GitHub (sin `node_modules` ni `dist`).
2. En vercel.com, «Add New Project» → importa el repositorio y, en el nombre del proyecto, escribe `cursoseducacioncontinua`.
3. Pulsa «Deploy».

## Autora

Msc. Betty Meneses Ayllón
