import { TestBed } from '@angular/core/testing';
import { PhotoDetail } from './photo-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteService } from '../../../services/favorite.service';
import { ImageApiService } from '../../../services/images-api';
import { provideZonelessChangeDetection, signal } from '@angular/core';

describe('PhotoDetail', () => {
  let component: PhotoDetail;
  let fixture: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockFavoriteService: jasmine.SpyObj<FavoriteService>;
  let mockImageApiService: jasmine.SpyObj<ImageApiService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    });
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', [
      'isFavorite',
      'removeFromFavorites',
    ]);

    Object.defineProperty(mockFavoriteService, 'favorites', {
      value: jasmine.createSpy('favorites').and.returnValue([]),
      writable: true,
    });

    mockImageApiService = jasmine.createSpyObj('ImageApiService', [], {
      images: signal([]),
    });

    await TestBed.configureTestingModule({
      imports: [PhotoDetail],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: ImageApiService, useValue: mockImageApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load image from favorites when id is provided', () => {
    const mockFavorites = [
      { id: 1, url: 'https://example.com/image1.jpg' },
      { id: 2, url: 'https://example.com/image2.jpg' },
    ];

    (mockFavoriteService.favorites as jasmine.Spy).and.returnValue(mockFavorites);

    component.ngOnInit();

    expect(component.image()).toEqual({
      id: 1,
      url: 'https://example.com/image1.jpg',
    });
  });

  it('should remove from favorites when image is favorite', () => {
    const mockImage = { id: 1, url: 'test.jpg' };
    component.image.set(mockImage);
    mockFavoriteService.isFavorite.and.returnValue(true);

    component.removeFromFavorites();

    expect(mockFavoriteService.removeFromFavorites).toHaveBeenCalledWith(mockImage);
  });

  it('should navigate back to favorites', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/favorites']);
  });
});
