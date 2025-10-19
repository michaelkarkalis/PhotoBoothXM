import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Navbar } from './navbar';
import { routes } from '../../app.routes';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter(routes),
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the application title', () => {
    const titleElement = fixture.debugElement.query(By.css('h1.app-title a'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('PhotoBooth XM');
  });

  it('should have navigation links with correct router links', () => {
    const photosLink = fixture.debugElement.query(By.css('a[routerLink="/photos"]'));
    const favoritesLink = fixture.debugElement.query(By.css('a[routerLink="/favorites"]'));

    expect(photosLink).toBeTruthy();
    expect(favoritesLink).toBeTruthy();
  });

  it('should display correct icons and text for navigation links', () => {
    const photosLink = fixture.debugElement.query(By.css('a[routerLink="/photos"]'));
    const favoritesLink = fixture.debugElement.query(By.css('a[routerLink="/favorites"]'));

    expect(photosLink.nativeElement.textContent.trim()).toContain('Photos');
    expect(photosLink.query(By.css('mat-icon')).nativeElement.textContent.trim()).toBe('photo_library');

    expect(favoritesLink.nativeElement.textContent.trim()).toContain('Favorites');
    expect(favoritesLink.query(By.css('mat-icon')).nativeElement.textContent.trim()).toBe('favorite');
  });

  it('should have proper accessibility attributes', () => {
    const header = fixture.debugElement.query(By.css('header'));
    const nav = fixture.debugElement.query(By.css('nav'));
    const titleLink = fixture.debugElement.query(By.css('h1.app-title a'));
    const icons = fixture.debugElement.queryAll(By.css('mat-icon'));

    expect(header).toBeTruthy();
    expect(nav.nativeElement.getAttribute('aria-label')).toBe('Primary navigation');
    expect(titleLink.nativeElement.getAttribute('aria-label')).toBe('PhotoBooth XM - Go to homepage');

    icons.forEach(icon => {
      expect(icon.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
