import { Component, ChangeDetectionStrategy, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { SelectOption } from '../types';

/**
 * Desplegable reutilizable con enlace bidireccional opcional [(value)].
 *
 * @example
 * ```html
 * <ui-select
 *   label="País"
 *   placeholder="Selecciona un país"
 *   [options]="countries()"
 *   [(value)]="selectedCountry"
 *   (selectionChange)="onCountryChange($event)"
 * />
 * ```
 *
 * @standalone
 */
@Component({
  selector: 'ui-select',
  imports: [CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SelectComponent {
  /** Lista de opciones disponibles */
  options = input<SelectOption[]>([]);

  /** Etiqueta que se muestra sobre el select */
  label = input<string>('');

  /** Texto placeholder cuando no hay selección */
  placeholder = input<string>('Selecciona una opción');

  /** Muestra skeleton loading en lugar del select */
  loading = input<boolean>(false);

  /** Desactiva la interacción con el select */
  disabled = input<boolean>(false);

  /** Valor seleccionado (model para two-way binding con [(value)]) */
  value = model<string | null>(null);

  /** Emite el objeto SelectOption completo al cambiar la selección */
  selectionChange = output<SelectOption>();

  /**
   * Maneja el evento change del select HTML.
   * Actualiza el valor y emite el objeto SelectOption completo.
   * @param event Evento change del elemento HTML select
   */
  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    const selectedOption = this.options().find(o => o.value === selectedValue);

    this.value.set(selectedValue);

    if (selectedOption) {
      this.selectionChange.emit(selectedOption);
    }
  }
}