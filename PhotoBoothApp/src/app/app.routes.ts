import { Routes } from '@angular/router';
import { Photos } from './pages/photos/photos';
import { Favorites } from './pages/favorites/favorites';

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
    path: 'favorites',
    component: Favorites
  },
  { path: '**', redirectTo: 'photos' }
];
