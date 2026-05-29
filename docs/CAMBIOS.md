# Registro de cambios

Documentación de todas las modificaciones realizadas en el workspace: mejoras visuales, corrección del build y comentarios en código.

---

## 1. Corrección del build y ejecución

### Problema

- `ng build demo-app` fallaba con error de TypeScript (`referencedFiles` / `rootDir`).
- `npm start` ejecutaba `ng serve` sin especificar proyecto en un workspace multi-proyecto.
- PostCSS usaba `@tailwindcss/postcss` (v4) con directivas Tailwind v3 (`@tailwind base`, etc.).
- Faltaba la carpeta `projects/demo-app/public` para assets.

### Solución

| Archivo | Cambio |
|---------|--------|
| `tsconfig.json` | `baseUrl: "."` y `paths.ui-lib` → `./dist/ui-lib` |
| `projects/demo-app/tsconfig.app.json` | Eliminado `rootDir` que impedía resolver imports de la librería |
| `angular.json` | `dependsOn: ["ui-lib:build"]` en el target `demo-app:build` |
| `projects/demo-app/.postcssrc.json` | Plugins `tailwindcss` + `autoprefixer` (v3) |
| `package.json` | Scripts: `start`, `build`, `build:lib`, `build:app` |
| `projects/demo-app/public/` | Carpeta creada para assets estáticos |

---

## 2. Mejoras visuales — demo-app

### `app.html`

- Estructura semántica: `header`, `main`, `footer`, secciones con `aria-labelledby`.
- Hero con título escalable y subtítulo sin animaciones `pulse` excesivas.
- Filtros en tarjetas (`.filter-card`) en lugar de bloques con muchas clases Tailwind inline.
- Paneles unificados para estados: carga, error y vacío (`.state-panel`).
- Panel de detalle del personaje separado del contenedor de la tabla.
- Pie con enlace a Rick and Morty API.
- Corrección ortográfica: «Género», «Ubicación».

### `app.css`

- Fondo con gradientes, capa de estrellas CSS (`.stars`) y `fondo.jpg` opcional con opacidad.
- Header sticky con glassmorphism.
- Animaciones reducidas; soporte global `prefers-reduced-motion` en `styles.css`.
- Estilos del panel de detalle (`.detail-grid`, `.detail-meta`, badges de estado).
- Diseño responsive para móvil.

### `styles.css`

- Variables CSS: fuentes, colores del tema portal.
- Antialiasing y estilo de selección de texto.
- Import de Google Fonts (Bungee Shade, Space Grotesk).

### `index.html`

- `lang="es"`.
- Título: «Rick & Morty — Explorador del Multiverso».

---

## 3. Mejoras visuales — ui-lib

### `ui-card`

- **Nuevo** `card.css` (antes referenciado pero inexistente).
- Clases BEM: `.ui-card`, `.ui-card-header`, `.ui-card-body`.
- Variantes: `flat`, `raised`, `outlined`.

### `ui-button`

- Botones tipo pill (`rounded-full`), gradientes y sombras por variante.
- Hover con elevación suave (sin animación glow infinita).

### `ui-select`

- Estilos propios en `select.css` (`.ui-select-control`, `.ui-select-label`).
- Skeleton de carga con shimmer.
- Flecha personalizada en el desplegable.

### `ui-table`

- Avatares circulares en columna `name` cuando la fila tiene `image`.
- Badges de estado: `Alive`, `Dead`, `unknown` (`.rm-badge--*`).
- Skeleton con animación shimmer.
- Botones de acción con `type="button"`.
- Método `getStatusClass()` para clases de badge.

---

## 4. Comentarios en código

- JSDoc y comentarios de bloque en **español** en archivos `.ts` de `demo-app` y `ui-lib`.
- Encabezados de sección en **español** en archivos `.css` principales.
- API pública documentada en `public-api.ts` y `types.ts`.

---

## 5. Archivos tocados (resumen)

```
tsconfig.json
angular.json
package.json
projects/demo-app/tsconfig.app.json
projects/demo-app/.postcssrc.json
projects/demo-app/public/.gitkeep
projects/demo-app/src/index.html
projects/demo-app/src/styles.css
projects/demo-app/src/main.ts
projects/demo-app/src/app/app.config.ts
projects/demo-app/src/app/app.ts
projects/demo-app/src/app/app.html
projects/demo-app/src/app/app.css
projects/demo-app/src/app/resource.ts
projects/ui-lib/src/public-api.ts
projects/ui-lib/src/lib/types.ts
projects/ui-lib/src/lib/button/button.ts
projects/ui-lib/src/lib/button/button.css
projects/ui-lib/src/lib/card/card.ts
projects/ui-lib/src/lib/card/card.html
projects/ui-lib/src/lib/card/card.css
projects/ui-lib/src/lib/select/select.ts
projects/ui-lib/src/lib/select/select.html
projects/ui-lib/src/lib/select/select.css
projects/ui-lib/src/lib/table/table.ts
projects/ui-lib/src/lib/table/table.html
projects/ui-lib/src/lib/table/table.css
README.md
docs/CAMBIOS.md
```
