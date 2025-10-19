import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteService } from '../../../services/favorite.service';
import { ImageApiService } from '../../../services/images-api';
import { Image } from '../../../core/models/image.model';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-photo-detail',
  imports: [MatIcon, MatButtonModule, CommonModule],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss',
})
export class PhotoDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  favoriteService = inject(FavoriteService);
  imageApiService = inject(ImageApiService);

  image = signal<Image | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadImage(parseInt(id, 10));
    }
  }

  private loadImage(id: number) {
    const favorites = this.favoriteService.favorites();
    const foundImage = favorites.find((img) => img.id === id);
    this.image.set(foundImage || null);
  }

  removeFromFavorites() {
    const currentImage = this.image();
    if (currentImage && this.favoriteService.isFavorite(currentImage)) {
      this.favoriteService.removeFromFavorites(currentImage);
    }
  }

  goBack() {
    this.router.navigate(['/favorites']);
  }

  isFavorite(): boolean {
    const currentImage = this.image();
    return currentImage ? this.favoriteService.isFavorite(currentImage) : false;
  }
}
