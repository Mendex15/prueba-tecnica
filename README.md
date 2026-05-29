# Rick & Morty — UI Component Library

Monorepo Angular 21 con librería de componentes reutilizable (`ui-lib`) y aplicación demo que consume la [Rick and Morty API](https://rickandmortyapi.com).

## Arquitectura

```
my-workspace/
├── projects/
│   ├── ui-lib/       # Librería: ui-button, ui-card, ui-select, ui-table
│   └── demo-app/     # Explorer: filtros, tabla, modal de detalle
├── dist/ui-lib/      # Build de la librería (path alias en tsconfig)
├── angular.json
└── package.json
```

- **Estado del flujo** (recurso, filtro, filas, loading, error): `ResourceService` con **signals**. Los componentes no hacen HTTP.
- **Convenciones**: standalone, `OnPush`, `input()` / `output()` / `model()`, prefijo `ui-`, `strict: true`, sin `any`.
- **Estilos**: Tailwind CSS **v3** únicamente (`tailwindcss` + `autoprefixer` en PostCSS).

## Instalación y ejecución

```bash
npm install
npm run build:lib    # Primera vez o tras cambiar ui-lib
ng serve demo-app    # http://localhost:4200
```

Equivalente:

```bash
npm start
```

Build de producción:

```bash
npm run build
```

## API de componentes (ui-lib)

### `ui-button`

| Tipo | Nombre | Tipo TS | Descripción |
|------|--------|---------|-------------|
| `input()` | `label` | `string` | Texto del botón |
| `input()` | `variant` | `'primary' \| 'secondary' \| 'danger'` | Estilo visual |
| `input()` | `size` | `'sm' \| 'md' \| 'lg'` | Tamaño |
| `input()` | `disabled` | `boolean` | Bloquea interacción |
| `input()` | `loading` | `boolean` | Spinner y bloqueo de click |
| `output()` | `clicked` | `void` | Emite si no está disabled ni loading |

```html
<ui-button
  label="Guardar"
  variant="primary"
  size="md"
  [loading]="guardando()"
  (clicked)="onGuardar()"
/>
```

---

### `ui-card`

| Tipo | Nombre | Tipo TS | Descripción |
|------|--------|---------|-------------|
| `input()` | `title` | `string` | Título del header |
| `input()` | `subtitle` | `string \| null` | Subtítulo opcional |
| `input()` | `elevation` | `'flat' \| 'raised' \| 'outlined'` | Estilo del contenedor |
| `output()` | `headerClicked` | `void` | Click en el header |
| proyección | — | — | Contenido en el body (`ng-content`) |

```html
<ui-card title="Detalle" subtitle="Personaje" elevation="raised" (headerClicked)="onHeader()">
  <p>Contenido proyectado</p>
</ui-card>
```

---

### `ui-select`

| Tipo | Nombre | Tipo TS | Descripción |
|------|--------|---------|-------------|
| `input()` | `options` | `SelectOption[]` | `{ label, value }` |
| `input()` | `label` | `string` | Etiqueta superior |
| `input()` | `placeholder` | `string` | Texto sin selección |
| `input()` | `loading` | `boolean` | Skeleton de carga |
| `input()` | `disabled` | `boolean` | Bloquea interacción |
| `model()` | `value` | `string \| null` | Two-way binding |
| `output()` | `selectionChange` | `SelectOption` | Opción completa al cambiar |

```html
<ui-select
  label="Recurso"
  placeholder="Elige uno"
  [options]="opciones"
  [(value)]="seleccion"
  (selectionChange)="onCambio($event)"
/>
```

---

### `ui-table`

| Tipo | Nombre | Tipo TS | Descripción |
|------|--------|---------|-------------|
| `input()` | `columns` | `TableColumn[]` | `{ key, header }` |
| `input()` | `rows` | `T[]` | Datos (genérico) |
| `input()` | `loading` | `boolean` | Filas skeleton |
| `input()` | `emptyMessage` | `string` | Sin resultados |
| `input()` | `errorMessage` | `string \| null` | Error de red en la tabla |
| `output()` | `actionTriggered` | `TableAction<T>` | `{ action: 'view' \| 'delete', row }` |

```html
<ui-table
  [columns]="columnas"
  [rows]="filas()"
  [loading]="cargando()"
  [errorMessage]="error()"
  emptyMessage="No hay datos"
  (actionTriggered)="onAccion($event)"
/>
```

**Tipos exportados:** `SelectOption`, `TableColumn`, `TableAction<T>` desde `'ui-lib'`.

---

## Flujo de la demo

1. **Recurso** (`ui-select`): Characters (por defecto) | Episodes | Locations → petición al endpoint correspondiente.
2. **Filtro de estado** (`ui-select`): solo activo para **personajes** (`alive` | `dead` | `unknown`). Se deshabilita en episodios/locaciones.
3. **Tabla** (`ui-table`): siempre visible; skeleton en `loading`, error y vacío dentro del componente.
4. **Ver detalle**: modal con `ui-card` y **todos los campos** del registro según el tipo.
5. **Eliminar**: botón en tabla; emite `delete` (sin persistencia local obligatoria).

## Decisiones de diseño

| Decisión | Motivo |
|----------|--------|
| Consumir `ui-lib` desde `dist/ui-lib` | Evita conflictos de `rootDir` y simula uso real de paquete publicado |
| `dependsOn: ui-lib:build` en `angular.json` | La demo compila tras la librería automáticamente |
| Filtro `status` solo en `/character` | La API no admite `?status=` en episode/location |
| Loading/error en `ui-table` | Cumple el enunciado: la tabla refleja esos estados |
| Modal overlay + Escape + backdrop | UX de detalle acorde a la prueba técnica |
| Tailwind v3 sin `@tailwindcss/postcss` v4 | Requisito explícito del enunciado |
| Interfaces API completas en `resource.ts` | Tipado estricto y detalle con todos los campos |

## Assets

En `projects/demo-app/public/`:

- `logo.png` — logo del header
- `fondo.jpg` — imagen de fondo
- `favicon.ico` — icono del navegador

## Documentación adicional

 
 **Estado de la documentación:**

- Se añadieron JSDoc en componentes públicos de `ui-lib` (`ui-button`, `ui-card`, `ui-table`) para documentar `input()`/`output()`/`model()` y métodos públicos.
- Las interfaces de la API (`Character`, `Episode`, `Location`) están definidas en [projects/demo-app/src/app/resource.ts](projects/demo-app/src/app/resource.ts) y se utilizan en la demo para garantizar tipado estricto (sin `any`).


## Tecnologías

Angular 21 · TypeScript (strict) · Tailwind CSS 3 · ng-packagr · Vitest
