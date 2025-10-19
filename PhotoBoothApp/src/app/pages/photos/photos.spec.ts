import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { Photos } from './photos';
import { ImageApiService } from '../../services/images-api';
import { FavoriteService } from '../../services/favorite.service';

describe('Photos', () => {
  let component: Photos;
  let fixture: ComponentFixture<Photos>;
  let mockImageApiService: jasmine.SpyObj<ImageApiService>;
  let mockFavoriteService: jasmine.SpyObj<FavoriteService>;

  beforeEach(async () => {
    mockImageApiService = jasmine.createSpyObj('ImageApiService', ['load']);
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', ['toggleFavorite']);

    Object.defineProperty(mockImageApiService, 'loading', {
      value: jasmine.createSpy('loading').and.returnValue(false),
      writable: true
    });

    Object.defineProperty(mockImageApiService, 'images', {
      value: jasmine.createSpy('images').and.returnValue([]),
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [Photos],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImageApiService, useValue: mockImageApiService },
        { provide: FavoriteService, useValue: mockFavoriteService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Photos);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial images on init', () => {
    component.ngOnInit();

    expect(mockImageApiService.load).toHaveBeenCalledWith(1, 20);
  });

  it('should load more images when loadMore is called', async () => {
    mockImageApiService.load.and.returnValue(Promise.resolve());
    (mockImageApiService.loading as jasmine.Spy).and.returnValue(false);

    await component.loadMore();

    expect(mockImageApiService.load).toHaveBeenCalledWith(2, 20);
  });

  it('should not load more images when already loading', async () => {
    (mockImageApiService.loading as jasmine.Spy).and.returnValue(true);
    mockImageApiService.load.calls.reset();

    await component.loadMore();

    expect(mockImageApiService.load).not.toHaveBeenCalled();
  });

  it('should increment page number on subsequent loadMore calls', async () => {
    mockImageApiService.load.and.returnValue(Promise.resolve());
    (mockImageApiService.loading as jasmine.Spy).and.returnValue(false);

    await component.loadMore();
    await component.loadMore();

    expect(mockImageApiService.load).toHaveBeenCalledWith(2, 20);
    expect(mockImageApiService.load).toHaveBeenCalledWith(3, 20);
    expect(mockImageApiService.load).toHaveBeenCalledTimes(2);
  });
});
