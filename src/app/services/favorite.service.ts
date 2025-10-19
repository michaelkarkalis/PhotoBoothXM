import { Injectable, signal, computed, inject, OnInit } from '@angular/core';
import { Image } from '../core/models/image.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'photo-booth-favorites';
  private readonly _favorites = signal<Image[]>([]);
  private readonly localStorageService = inject(LocalStorageService);

  readonly favorites = computed(() => this._favorites());

  constructor() {
    this.loadFromStorage();
  }

  isFavorite(image: Image): boolean {
    return this._favorites().some((fav) => fav.url === image.url);
  }

  addToFavorites(image: Image): void {
    if (!this.isFavorite(image)) {
      this._favorites.update((current) => [...current, image]);
      this.saveToStorage();
    }
  }

  removeFromFavorites(image: Image): void {
    this._favorites.update((current) => current.filter((fav) => fav.url !== image.url));
    this.saveToStorage();
  }

  toggleFavorite(image: Image): void {
    if (this.isFavorite(image)) {
      this.removeFromFavorites(image);
    } else {
      this.addToFavorites(image);
    }
  }

  private loadFromStorage(): void {
    const favorites = this.localStorageService.getObject<Image[]>(this.STORAGE_KEY);
    if (favorites) {
      this._favorites.set(favorites);
    } else {
      this._favorites.set([]);
    }
  }

  private saveToStorage(): void {
    const success = this.localStorageService.setObject(this.STORAGE_KEY, this._favorites());
    if (!success) {
      console.error('Failed to save favorites to storage');
    }
  }
}
