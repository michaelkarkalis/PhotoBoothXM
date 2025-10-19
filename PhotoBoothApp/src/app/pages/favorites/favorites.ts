import { Component, inject } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { Image } from '../../core/models/image.model';
import { ImageCard } from '../../core/components/image-card/image-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [ImageCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  service = inject(FavoriteService);
  private router = inject(Router);

  navigateToDetail(image: Image) {
    this.router.navigate(['/photos', image.id]);
  }
}
