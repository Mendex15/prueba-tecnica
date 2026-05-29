/**
 * Servicio de dominio: obtiene personajes, episodios y locaciones
 * desde la API pública de Rick and Morty.
 */
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Tipos de recurso soportados por la API */
export type ResourceType = 'character' | 'episode' | 'location';

/** Referencia anidada en la API (origen, ubicación, etc.) */
export interface ApiRef {
  name: string;
  url: string;
}

/** Personaje — campos relevantes de GET /character */
export interface Character extends Record<string, unknown> {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: ApiRef;
  location: ApiRef;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/** Episodio — campos relevantes de GET /episode */
export interface Episode extends Record<string, unknown> {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

/** Locación — campos relevantes de GET /location */
export interface Location extends Record<string, unknown> {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

/** Unión de todos los ítems que puede mostrar la tabla */
export type ResourceItem = Character | Episode | Location;

/** Respuesta paginada típica de la API (solo usamos results) */
interface ApiResponse<T> {
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly BASE_URL = 'https://rickandmortyapi.com/api';

  activeResource = signal<ResourceType>('character');
  statusFilter = signal<string>('');
  rows = signal<ResourceItem[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.fetchData();
  }

  setResource(resource: ResourceType) {
    this.activeResource.set(resource);
    this.statusFilter.set('');
    this.fetchData();
  }

  /** Solo personajes admiten ?status= en la API */
  setFilter(status: string) {
    if (this.activeResource() !== 'character') {
      return;
    }
    this.statusFilter.set(status);
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    this.error.set(null);

    const resource = this.activeResource();
    const status = this.statusFilter();
    const url =
      resource === 'character' && status
        ? `${this.BASE_URL}/character?status=${status}`
        : `${this.BASE_URL}/${resource}`;

    this.http.get<ApiResponse<ResourceItem>>(url).subscribe({
      next: (data) => {
        this.rows.set(data.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los datos. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  /** Elimina un registro del estado local (demo; no llama a la API) */
  removeRow(id: number) {
    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }
}
