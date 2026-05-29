/**
 * Componente raíz de la demo Rick & Morty.
 * Orquesta filtros, tabla (ui-lib), modal de detalle y estados de carga/error en la tabla.
 */
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  CardComponent,
  SelectComponent,
  TableComponent,
  type SelectOption,
  type TableColumn,
  type TableAction,
} from 'ui-lib';
import { ResourceService, ResourceType, ResourceItem, Character, Episode, Location } from './resource';

/** Par etiqueta-valor para el modal de detalle */
export interface DetailEntry {
  label: string;
  value: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ButtonComponent, CardComponent, SelectComponent, TableComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  resourceService = inject(ResourceService);

  selectedResource = signal<string>('character');
  selectedFilter = signal<string | null>(null);
  selectedRow = signal<ResourceItem | null>(null);
  showModal = signal<boolean>(false);

  resourceOptions = [
    { label: 'Personajes', value: 'character' },
    { label: 'Episodios', value: 'episode' },
    { label: 'Locaciones', value: 'location' },
  ];

  statusOptions = [
    { label: 'Alive', value: 'alive' },
    { label: 'Dead', value: 'dead' },
    { label: 'Unknown', value: 'unknown' },
  ];

  /** Cierra el modal con la tecla Escape */
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showModal()) {
      this.closeModal();
    }
  }

  /** El filtro de estado solo aplica a personajes */
  isStatusFilterEnabled(): boolean {
    return this.resourceService.activeResource() === 'character';
  }

  getColumns(): TableColumn[] {
    const resource = this.resourceService.activeResource();
    if (resource === 'character') {
      return [
        { key: 'name', header: 'Nombre' },
        { key: 'status', header: 'Estado' },
        { key: 'species', header: 'Especie' },
      ];
    }
    if (resource === 'episode') {
      return [
        { key: 'name', header: 'Nombre' },
        { key: 'episode', header: 'Episodio' },
        { key: 'air_date', header: 'Fecha' },
      ];
    }
    return [
      { key: 'name', header: 'Nombre' },
      { key: 'type', header: 'Tipo' },
      { key: 'dimension', header: 'Dimensión' },
    ];
  }

  onResourceChange(option: SelectOption) {
    this.selectedResource.set(option.value);
    this.selectedFilter.set(null);
    this.closeModal();
    this.resourceService.setResource(option.value as ResourceType);
  }

  onFilterChange(option: SelectOption) {
    if (!this.isStatusFilterEnabled()) {
      return;
    }
    this.selectedFilter.set(option.value);
    this.resourceService.setFilter(option.value);
  }

  onAction(event: TableAction<Record<string, unknown>>) {
    if (event.action === 'view') {
      const current = this.selectedRow();
      const next = event.row as ResourceItem;
      const currentId = (current as Character | Episode | Location | null)?.id;
      const nextId = (next as Character | Episode | Location).id;
      if (currentId === nextId && this.showModal()) {
        this.closeModal();
        return;
      }
      this.selectedRow.set(next);
      this.showModal.set(true);
    } else if (event.action === 'delete') {
      this.confirmAndDeleteRow(event.row as ResourceItem);
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedRow.set(null);
  }

  asCharacter(row: ResourceItem): Character {
    return row as Character;
  }

  asEpisode(row: ResourceItem): Episode {
    return row as Episode;
  }

  asLocation(row: ResourceItem): Location {
    return row as Location;
  }

  getEmptyMessageForResource(): string {
    const resource = this.resourceService.activeResource();
    if (resource === 'character') return 'personajes';
    if (resource === 'episode') return 'episodios';
    return 'locaciones';
  }

  getModalTitle(): string {
    const row = this.selectedRow();
    if (!row) return '';
    return String(row['name'] ?? '');
  }

  getModalSubtitle(): string | null {
    const resource = this.resourceService.activeResource();
    if (resource === 'character') return 'Personaje';
    if (resource === 'episode') return 'Episodio';
    return 'Locación';
  }

  /** Lista completa de campos para el modal según el recurso activo */
  getDetailEntries(): DetailEntry[] {
    const row = this.selectedRow();
    if (!row) return [];

    const resource = this.resourceService.activeResource();
    if (resource === 'character') {
      return this.buildCharacterEntries(row as Character);
    }
    if (resource === 'episode') {
      return this.buildEpisodeEntries(row as Episode);
    }
    return this.buildLocationEntries(row as Location);
  }

  hasDetailImage(): boolean {
    return (
      this.resourceService.activeResource() === 'character' &&
      Boolean((this.selectedRow() as Character | null)?.image)
    );
  }

  getDetailImageUrl(): string {
    return (this.selectedRow() as Character)?.image ?? '';
  }

  onDeleteConfirm() {
    const row = this.selectedRow();
    if (row) {
      this.confirmAndDeleteRow(row);
    }
  }

  /** Confirmación y borrado del estado local */
  private confirmAndDeleteRow(row: ResourceItem) {
    const title = String(row['name'] ?? 'este registro');
    const confirm = window.confirm(`¿Estás seguro de que quieres eliminar "${title}"?`);
    if (!confirm) {
      return;
    }
    this.resourceService.removeRow(row.id);
    if (this.selectedRow()?.id === row.id) {
      this.closeModal();
    }
  }

  clearFilters() {
    this.selectedFilter.set(null);
    if (this.isStatusFilterEnabled()) {
      this.resourceService.setFilter('');
    }
  }

  retryLoad() {
    this.resourceService.fetchData();
  }

  getResourceLabel(): string {
    const resource = this.resourceService.activeResource();
    if (resource === 'character') return 'Personajes';
    if (resource === 'episode') return 'Episodios';
    return 'Locaciones';
  }

  /** Formatea listas de URLs de la API (episodios, residentes, personajes) */
  formatApiUrlList(urls: string[] | undefined): string {
    if (!urls?.length) {
      return '—';
    }
    const ids = urls
      .map((url) => url.split('/').filter(Boolean).pop() ?? '')
      .filter(Boolean)
      .join(', ');
    return `${urls.length} registro(s): ${ids}`;
  }

  private buildCharacterEntries(c: Character): DetailEntry[] {
    return [
      { label: 'ID', value: String(c.id) },
      { label: 'Nombre', value: c.name },
      { label: 'Estado', value: c.status },
      { label: 'Especie', value: c.species },
      { label: 'Tipo', value: c.type || '—' },
      { label: 'Género', value: c.gender },
      { label: 'Origen', value: c.origin?.name ?? '—' },
      { label: 'URL origen', value: c.origin?.url ?? '—' },
      { label: 'Ubicación', value: c.location?.name ?? '—' },
      { label: 'URL ubicación', value: c.location?.url ?? '—' },
      { label: 'Episodios', value: this.formatApiUrlList(c.episode) },
      { label: 'URL personaje', value: c.url },
      { label: 'Creado', value: c.created },
    ];
  }

  private buildEpisodeEntries(e: Episode): DetailEntry[] {
    return [
      { label: 'ID', value: String(e.id) },
      { label: 'Nombre', value: e.name },
      { label: 'Código', value: e.episode },
      { label: 'Fecha emisión', value: e.air_date },
      { label: 'Personajes', value: this.formatApiUrlList(e.characters) },
      { label: 'URL episodio', value: e.url },
      { label: 'Creado', value: e.created },
    ];
  }

  private buildLocationEntries(l: Location): DetailEntry[] {
    return [
      { label: 'ID', value: String(l.id) },
      { label: 'Nombre', value: l.name },
      { label: 'Tipo', value: l.type },
      { label: 'Dimensión', value: l.dimension },
      { label: 'Residentes', value: this.formatApiUrlList(l.residents) },
      { label: 'URL locación', value: l.url },
      { label: 'Creado', value: l.created },
    ];
  }
}
