import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Botón reutilizable con variantes de color, tamaños y estado de carga.
 *
 * @example
 * ```html
 * <ui-button
 *   label="Guardar"
 *   variant="primary"
 *   size="md"
 *   [loading]="guardando()"
 *   (clicked)="onGuardar()"
 * />
 * ```
 */
@Component({
  selector: 'ui-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ButtonComponent {
  /** Texto visible del botón */
  label = input<string>('');

  /** primary (verde), secondary (gris), danger (rojo) */
  variant = input<'primary' | 'secondary' | 'danger'>('primary');

  /** sm | md | lg */
  size = input<'sm' | 'md' | 'lg'>('md');

  /** Desactiva clics */
  disabled = input<boolean>(false);

  /** Muestra spinner y bloquea clics */
  loading = input<boolean>(false);

  /** Emite al hacer clic si no está disabled ni loading */
  clicked = output<void>();

  /**
   * Maneja el clic del botón: emite `clicked` si está habilitado
   * y no se encuentra en estado `loading`.
   */
  handleClick() {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }

  /** Construye clases Tailwind según variant y size (tema portal Rick & Morty) */
  getClasses(): string {
    const base =
      'inline-flex items-center justify-center font-bold uppercase tracking-wide rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 gap-2 shadow-md';

    const variants = {
      primary:
        'bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 hover:from-emerald-300 hover:to-green-400 focus:ring-emerald-400 shadow-emerald-500/30',
      secondary:
        'bg-slate-800/90 text-slate-100 border border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700 focus:ring-slate-500 shadow-black/20',
      danger:
        'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 focus:ring-rose-400 shadow-rose-500/25',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-xs min-h-8',
      md: 'px-5 py-2.5 text-sm min-h-10',
      lg: 'px-7 py-3 text-base min-h-12',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  }
}
