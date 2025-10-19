import { Component, inject, input, output } from '@angular/core';
import { FavoriteService } from '../../../services/favorite.service';
import { Image } from '../../models/image.model';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-card',
  imports: [MatIcon, NgOptimizedImage],
  templateUrl: './image-card.html',
  styleUrl: './image-card.scss',
})
export class ImageCard {
  image = input.required<Image>();
  enableNavigation = input<boolean>(false);
  enableFavorite = input<boolean>(false);
  index = input<number | null>(null);

  onNavigate = output<Image>();
  onFavoriteToggle = output<Image>();

  favoriteService = inject(FavoriteService);

  action() {
    if (this.enableFavorite()) {
      this.toggleFavorite();
    } else if (this.enableNavigation()) {
      this.navigateToDetail();
    }
  }

  navigateToDetail() {
    this.onNavigate.emit(this.image());
  }

  toggleFavorite() {
    this.onFavoriteToggle.emit(this.image());
  }
}
