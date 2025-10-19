import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FavoriteService } from './favorite.service';
import { LocalStorageService } from './local-storage.service';
import { Image } from '../core/models/image.model';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let localStorageService: LocalStorageService;
  let mockImage: Image;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LocalStorageService,
        FavoriteService
      ]
    }).compileComponents();

    service = TestBed.inject(FavoriteService);
    localStorageService = TestBed.inject(LocalStorageService);
    mockImage = { id: 1, url: 'https://example.com/image1.jpg' };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty favorites', () => {
    expect(service.favorites()).toEqual([]);
  });

  it('should add image to favorites', () => {
    service.addToFavorites(mockImage);
    expect(service.favorites()).toContain(mockImage);
    expect(service.isFavorite(mockImage)).toBe(true);
  });

  it('should remove image from favorites', () => {
    service.addToFavorites(mockImage);
    service.removeFromFavorites(mockImage);
    expect(service.favorites()).not.toContain(mockImage);
    expect(service.isFavorite(mockImage)).toBe(false);
  });

  it('should toggle favorite status', () => {
    expect(service.isFavorite(mockImage)).toBe(false);

    service.toggleFavorite(mockImage);
    expect(service.isFavorite(mockImage)).toBe(true);

    service.toggleFavorite(mockImage);
    expect(service.isFavorite(mockImage)).toBe(false);
  });

  it('should persist favorites to localStorage', () => {
    service.addToFavorites(mockImage);
    const stored = localStorageService.getObject<Image[]>('photo-booth-favorites');
    expect(stored).toBeTruthy();
    expect(stored).toContain(mockImage);
  });

  it('should load favorites from localStorage on initialization', () => {

    localStorageService.clear();

    localStorageService.setObject('photo-booth-favorites', [mockImage]);

    expect(service.favorites()).toEqual([]);

    service.addToFavorites(mockImage);
    const anotherImage: Image = { id: 2, url: 'https://example.com/image2.jpg' };
    service.addToFavorites(anotherImage);

    const stored = localStorageService.getObject<Image[]>('photo-booth-favorites');
    expect(stored).toContain(mockImage);
    expect(stored).toContain(anotherImage);
  });

  it('should not add duplicate favorites', () => {
    service.addToFavorites(mockImage);
    service.addToFavorites(mockImage);

    expect(service.favorites().filter(img => img.url === mockImage.url).length).toBe(1);
  });
});
