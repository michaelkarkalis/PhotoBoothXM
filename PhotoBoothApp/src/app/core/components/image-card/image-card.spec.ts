import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { ImageCard } from './image-card';
import { provideZonelessChangeDetection } from '@angular/core';
import { FavoriteService } from '../../../services/favorite.service';
import { Image } from '../../models/image.model';

describe('ImageCard', () => {
  let component: ImageCard;
  let fixture: ComponentFixture<ImageCard>;
  let favoriteService: jasmine.SpyObj<FavoriteService>;
  let mockImage: Image;

  beforeEach(async () => {
    const favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', ['isFavorite']);

    await TestBed.configureTestingModule({
      imports: [ImageCard],
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: favoriteServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCard);
    component = fixture.componentInstance;
    favoriteService = TestBed.inject(FavoriteService) as jasmine.SpyObj<FavoriteService>;

    mockImage = { id: 1, url: 'https://example.com/image1.jpg' };
    fixture.componentRef.setInput('image', mockImage);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onNavigate when enableNavigation is true and action is called', () => {

    fixture.componentRef.setInput('enableNavigation', true);
    fixture.componentRef.setInput('enableFavorite', false);
    spyOn(component.onNavigate, 'emit');

    component.action();
    expect(component.onNavigate.emit).toHaveBeenCalledWith(mockImage);
  });

  it('should emit onFavoriteToggle when enableFavorite is true and action is called', () => {

    fixture.componentRef.setInput('enableFavorite', true);
    fixture.componentRef.setInput('enableNavigation', false);
    spyOn(component.onFavoriteToggle, 'emit');

    component.action();
    expect(component.onFavoriteToggle.emit).toHaveBeenCalledWith(mockImage);
  });

  it('should prioritize favorite over navigation when both are enabled', () => {

    fixture.componentRef.setInput('enableFavorite', true);
    fixture.componentRef.setInput('enableNavigation', true);
    spyOn(component.onFavoriteToggle, 'emit');
    spyOn(component.onNavigate, 'emit');

    component.action();
    expect(component.onFavoriteToggle.emit).toHaveBeenCalledWith(mockImage);
    expect(component.onNavigate.emit).not.toHaveBeenCalled();
  });
});
