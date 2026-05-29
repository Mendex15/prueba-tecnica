# Bitácora de desarrollo — UI Component Library

**Proyecto:** Librería Angular + demo Rick & Morty  
**Estado actual:** Listo para revisión técnica (código + documentación alineados con el enunciado)  
**Última actualización:** 29 de mayo de 2026

---

## Estado actual del entregable

### Implementado según la prueba técnica

| Requisito | Estado |
|-----------|--------|
| Workspace `ui-lib` + `demo-app` | OK |
| 4 componentes con API del PDF | OK |
| Signals, OnPush, standalone, prefijo `ui-` | OK |
| `public-api.ts` sin imports internos en demo | OK |
| `ResourceService` con signals (sin HTTP en componentes) | OK |
| Tabla siempre visible; skeleton/error/empty en `ui-table` | OK |
| Modal real de detalle con todos los campos por recurso | OK |
| Filtro de estado solo para personajes | OK |
| README con tablas API + decisiones de diseño | OK |
| Tailwind CSS v3 únicamente (sin `@tailwindcss/postcss` v4) | OK |
| JSDoc en componentes (español) | OK |

### Pendiente fuera del código (entregables del candidato)

- Repositorio en GitHub y enlace de entrega
- **Video explicativo** de la demo y decisiones de la librería
- Commits atómicos con Conventional Commits (revisar historial de git)

### Deseables no implementados

- Storybook, publicación npm/GitHub Packages, deploy (Vercel/Netlify)

---

## Cambios recientes (29 mayo 2026)

1. **Modal de detalle** — Overlay fijo, cierre con backdrop, botón × y tecla Escape. `ui-card` muestra todos los campos de Character, Episode y Location.
2. **Tabla siempre visible** — Eliminados paneles de carga/error a nivel app; `[loading]` y `[errorMessage]` se delegan a `ui-table`.
3. **Filtro de estado** — `?status=` solo si `activeResource === 'character'`; select deshabilitado en episodios/locaciones.
4. **Interfaces API** — `Character`, `Episode`, `Location` con campos completos (`url`, `created`, listas de URLs, etc.).
5. **README** — Tablas de inputs/outputs por componente, decisiones de diseño, `ng serve demo-app`.
6. **Tailwind** — Eliminado `@tailwindcss/postcss` v4 de `package.json`; PostCSS usa solo `tailwindcss` + `autoprefixer`.

---

## Retos y soluciones

| Reto | Solución |
|------|----------|
| Build de demo fallaba con path a fuentes de ui-lib | `paths` → `dist/ui-lib`, quitar `rootDir` restrictivo, `dependsOn` en angular.json |
| Interfaces no exportadas en dist | `types.ts` centralizado + `public-api.ts` |
| Filtro status en episode/location rompía peticiones | URL con `?status=` solo para `/character` |
| Enunciado pide skeleton/error en tabla | Tabla siempre en DOM; estados en `ui-table` |
| Detalle solo para personajes | `getDetailEntries()` por tipo de recurso |
| Conflicto Tailwind v3 vs v4 en package.json | Quitar paquete v4; `.postcssrc.json` y `postcss.config.js` con plugins v3 |

---

## Uso de IA (transparencia)

Herramientas usadas: Cursor / Claude para estructura, estilos, documentación y corrección de build.

| Prompt / tarea | Aceptado | Rechazado / modificado |
|----------------|----------|----------------------|
| Arreglar build monorepo y paths de librería | `dist/ui-lib`, `dependsOn`, PostCSS v3 | Alias `@tailwindcss/postcss` v4 |
| Mejorar UI tema Rick & Morty | Paleta, modal, tabla con badges/avatares | Animaciones pulse excesivas |
| Cumplir huecos del PDF (modal, tabla, filtro) | Modal overlay, detalle completo, filtro solo characters | Panel inline en lugar de modal |
| Documentación | README con tablas API, JSDoc en español | — |

**Criterio:** solo se integró código alineado con Angular 17+, strict mode y el PDF; sin Material/PrimeNG.

---

## Decisiones de diseño (resumen)

1. **`types.ts` centralizado** — Exportación fiable de interfaces en el bundle de tipos.
2. **Imports desde `'ui-lib'`** — Consumo como librería publicada, no rutas internas.
3. **`Record<string, unknown>` en modelos de demo** — Compatibilidad con `TableComponent<T>` genérico.
4. **Modal vs panel inline** — Overlay para cumplir “modal” del enunciado y mejor UX.
5. **Estados en ui-table** — El padre no oculta la tabla durante loading/error.

---

## Referencias

- [Angular Libraries](https://angular.dev/tools/libraries/creating-libraries)
- [Signals](https://angular.dev/guide/signals)
- [Rick and Morty API](https://rickandmortyapi.com/documentation)
- [Tailwind CSS v3 + Angular](https://v3.tailwindcss.com/docs/guides/angular)

---

## Historial anterior

Las fases 1–4 (tipado, Tailwind, documentación inicial) quedan en el historial de git. Este archivo refleja el **estado real** del proyecto tras alinear con la prueba técnica completa.
