import { Injectable, signal, computed } from '@angular/core';
import { Image } from '../core/models/image.model';

@Injectable({ providedIn: 'root' })
export class ImageApiService {
  private readonly _images = signal<Image[]>([]);
  private readonly _loading = signal(false);

  readonly images = computed(() => this._images());
  readonly loading = computed(() => this._loading());

  async load(page = 1, pageSize = 10): Promise<void> {
    this._loading.set(true);

    // emulate API latency
    await this.apiLatencyEmulation();

    const startId = (page - 1) * pageSize;

    const batch: Image[] = Array.from({ length: pageSize }, (_, i) => {
      const random = crypto.getRandomValues(new Uint32Array(1))[0];
      const id = startId + random;
      return { id, url: `https://picsum.photos/seed/${id}/800/600` };
    });

    this._images.update((curr) => [...curr, ...batch]);
    this._loading.set(false);
  }

  async apiLatencyEmulation(): Promise<void> {
    const wait = 200 + Math.random() * 100;

    return new Promise((r) => setTimeout(r, wait));
  }
}
