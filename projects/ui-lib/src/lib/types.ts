/**
 * Tipos e interfaces compartidos por los componentes de ui-lib.
 */

/** Opción de un desplegable ui-select */
export interface SelectOption {
  label: string;
  value: string;
}

/** Definición de una columna en ui-table */
export interface TableColumn {
  /** Clave del campo en cada fila (ej. 'name', 'status') */
  key: string;
  /** Texto visible en el encabezado */
  header: string;
}

/** Evento emitido al pulsar Ver o Eliminar en ui-table */
export interface TableAction<T = unknown> {
  action: 'view' | 'delete';
  row: T;
}
