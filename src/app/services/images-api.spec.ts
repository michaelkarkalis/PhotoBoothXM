import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ImageApiService } from './images-api';

describe('ImageApiService', () => {
  let service: ImageApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    service = TestBed.inject(ImageApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load images and manage loading state', async () => {
    const loadPromise = service.load(1, 5);
    expect(service.loading()).toBe(true);

    await loadPromise;

    expect(service.loading()).toBe(false);
    expect(service.images().length).toBe(5);

    service.images().forEach(image => {
      expect(image.id).toBeDefined();
      expect(image.url).toMatch(/https:\/\/picsum\.photos\/seed\/\d+\/800\/600/);
    });
  });

  it('should append images on subsequent loads', async () => {
    await service.load(1, 3);
    expect(service.images().length).toBe(3);

    const firstBatchIds = service.images().map(img => img.id);

    await service.load(2, 3);
    expect(service.images().length).toBe(6);

    service.images().slice(0, 3).forEach((img, index) => {
      expect(img.id).toBe(firstBatchIds[index]);
    });

    service.images().forEach(image => {
      expect(image.url).toMatch(/https:\/\/picsum\.photos\/seed\/\d+\/800\/600/);
    });
  });
});
