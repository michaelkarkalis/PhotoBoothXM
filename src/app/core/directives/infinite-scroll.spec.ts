import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfiniteScrollDirective } from './infinite-scroll';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  template: `
    <div [infiniteScroll] [disabled]="disabled" (reachedEnd)="onReachedEnd()">Content</div>
  `,
  standalone: true,
  imports: [InfiniteScrollDirective],
})
class TestComponent {
  disabled = false;
  reachedEndCount = 0;

  onReachedEnd(): void {
    this.reachedEndCount++;
  }
}

describe('InfiniteScrollDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: InfiniteScrollDirective;
  let intersectionCallback: IntersectionObserverCallback;

  let mockObserve = jasmine.createSpy('observe');
  let mockDisconnect = jasmine.createSpy('disconnect');

  beforeEach(async () => {

    (window as any).IntersectionObserver = function(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
      return { observe: mockObserve, disconnect: mockDisconnect };
    };

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideRouter(routes), provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directive = fixture.debugElement
      .query(By.directive(InfiniteScrollDirective))
      .injector.get(InfiniteScrollDirective);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should emit reachedEnd when intersecting and not disabled', () => {
    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry;
    intersectionCallback([mockEntry], {} as IntersectionObserver);
    expect(component.reachedEndCount).toBe(1);
  });

  it('should not emit when disabled', async () => {
    component.disabled = true;
    await fixture.changeDetectorRef.detectChanges();
    await fixture.whenStable();

    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry;
    intersectionCallback([mockEntry], {} as IntersectionObserver);
    expect(component.reachedEndCount).toBe(0);
  });

  it('should disconnect observer on destroy', () => {
    directive.ngOnDestroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
