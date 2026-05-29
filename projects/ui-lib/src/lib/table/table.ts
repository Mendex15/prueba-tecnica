import { Component, ChangeDetectionStrategy, input, output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { TableColumn, TableAction } from '../types';

/**
 * Tabla genérica con estados de carga, vacío y error.
 * No conoce el dominio: el padre interpreta `actionTriggered`.
 *
 * Renderizado especial:
 * - columna `name` + campo `image` → avatar circular
 * - columna `status` → badge de color (Alive / Dead / unknown)
 */
@Component({
  selector: 'ui-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TableComponent {
  /** Columnas a mostrar en la tabla ({ key, header }) */
  columns = input<TableColumn[]>([]);

  /** Filas a renderizar (genérico) */
  rows = input<Record<string, unknown>[]>([]);

  /** Estado de carga: muestra skeletonRows */
  loading = input<boolean>(false);

  /** Mensaje que se muestra cuando no hay resultados */
  emptyMessage = input<string>('No hay resultados');

  /** Mensaje de error de red (o null) */
  errorMessage = input<string | null>(null);

  /** Evento al pulsar Ver o Eliminar */
  actionTriggered = output<TableAction<Record<string, unknown>>>();

  /** Número de filas skeleton durante loading */
  skeletonRows = Array(5).fill(null);

  constructor(private cdr: ChangeDetectorRef) {}

  /** Emite la acción `view` con la fila seleccionada. */
  onView(row: Record<string, unknown>) {
    this.actionTriggered.emit({ action: 'view', row });
    this.cdr.markForCheck();
  }

  /** Emite la acción `delete` con la fila seleccionada. */
  onDelete(row: Record<string, unknown>) {
    this.actionTriggered.emit({ action: 'delete', row });
    this.cdr.markForCheck();
  }

  /** Valor de celda como texto */
  getCellValue(row: Record<string, unknown>, key: string): string {
    return String(row[key] ?? '');
  }

  /**
   * Clase CSS del badge de estado (personajes de la API).
   * @param status Valor crudo: Alive, Dead, unknown, etc.
   */
  getStatusClass(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized === 'alive') {
      return 'rm-badge--alive';
    }
    if (normalized === 'dead') {
      return 'rm-badge--dead';
    }
    return 'rm-badge--unknown';
  }
}
