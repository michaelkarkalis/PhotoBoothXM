import { Component, inject, OnInit } from '@angular/core';
import { ImageApiService } from '../../services/images-api';
import { InfiniteScrollDirective } from '../../core/directives/infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCard } from '../../core/components/image-card/image-card';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-photos',
  imports: [
    InfiniteScrollDirective,
    MatProgressSpinnerModule,
    ImageCard,
  ],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos implements OnInit {
  private page = 1;
  private readonly size = 20;

  imageApiService = inject(ImageApiService);
  favoriteService = inject(FavoriteService);

  ngOnInit() {
    this.imageApiService.load(this.page, this.size);
  }

  async loadMore() {
    if (this.imageApiService.loading()) return;
    this.page++;
    await this.imageApiService.load(this.page, this.size);
  }
}
