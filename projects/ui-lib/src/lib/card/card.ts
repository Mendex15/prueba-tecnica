import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Tarjeta con cabecera (título/subtítulo) y cuerpo con proyección de contenido.
 *
 * @example
 * ```html
 * <ui-card title="Detalle" subtitle="Personaje" elevation="raised">
 *   <p>Contenido aquí</p>
 * </ui-card>
 * ```
 */
@Component({
  selector: 'ui-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CardComponent {
  /** Título en la cabecera */
  title = input<string>('');

  /** Subtítulo opcional bajo el título */
  subtitle = input<string | null>(null);

  /**
   * Estilo de elevación:
   * - flat: base
   * - raised: sombra más marcada
   * - outlined: borde verde destacado
   */
  elevation = input<'flat' | 'raised' | 'outlined'>('flat');

  /** Se emite al hacer clic en la cabecera */
  headerClicked = output<void>();

  /** Maneja el click en la cabecera y emite `headerClicked`. */
  onHeaderClick() {
    this.headerClicked.emit();
  }

  /** Devuelve clases CSS del contenedor según elevation */
  getContainerClasses(): string {
    const elevations = {
      flat: 'ui-card',
      raised: 'ui-card ui-card--raised',
      outlined: 'ui-card ui-card--outlined',
    };

    return elevations[this.elevation()];
  }
}
