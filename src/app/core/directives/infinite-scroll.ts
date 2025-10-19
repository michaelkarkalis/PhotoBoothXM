import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() disabled = false;
  @Output() reachedEnd = new EventEmitter<void>();

  private obs?: IntersectionObserver;
  private sentinel!: HTMLElement;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.host.nativeElement;

    el.style.overflow = el.style.overflow || 'auto';

    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }

    this.sentinel = document.createElement('div');

    Object.assign(this.sentinel.style, { width: '100%', height: '1px' });

    el.appendChild(this.sentinel);

    this.obs = new IntersectionObserver(
      (entries) => {
        if (this.disabled) return;

        if (entries.some((e) => e.isIntersecting)) {
          this.reachedEnd.emit();
        }
      },
      { root: el, rootMargin: '0px 0px 200px 0px', threshold: 0 }
    );

    this.obs.observe(this.sentinel);
  }

  ngOnDestroy(): void {
    this.obs?.disconnect();
    this.sentinel?.remove();
  }
}
