import { Routes } from '@angular/router';
import { Photos } from './pages/photos/photos';
import { Favorites } from './pages/favorites/favorites';
import { PhotoDetail } from './pages/photos/photo-detail/photo-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'photos',
    pathMatch: 'full'
  },
  {
    path: 'photos',
    component: Photos
  },
  {
    path: 'photos/:id',
    component: PhotoDetail
  },
  {
    path: 'favorites',
    component: Favorites
  },
  { path: '**', redirectTo: 'photos' }
];
