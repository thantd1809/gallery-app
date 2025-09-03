import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements OnInit, OnDestroy {
  categories: string[] = ['less', 'more', 'normal'];
  labels: Record<string, string> = {
    less: 'Ít',
    more: 'Nhiều',
    normal: 'Bình thường'
  };

  selected = 'less';
  manifest: Record<string, string[]> = {};
  images: string[] = [];
  loaded = false;

  // Lightbox state
  lightboxOpen = false;
  currentIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Record<string, string[]>>('/assets/images.json').subscribe({
      next: data => {
        this.manifest = data;
        this.onCategoryChange();
        this.loaded = true;
      },
      error: err => {
        console.error('Error loading manifest', err);
        this.loaded = true;
      }
    });

    window.addEventListener('keydown', this.keyHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
  }

  onCategoryChange() {
    const files = this.manifest[this.selected] || [];
    this.images = files.map(f => `/assets/${this.selected}/${f}`);
  }

  // Lightbox methods
  openLightbox(index: number) {
    this.currentIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  prev(event?: Event) {
    event?.stopPropagation();
    if (this.images.length) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }

  next(event?: Event) {
    event?.stopPropagation();
    if (this.images.length) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  private keyHandler = (e: KeyboardEvent) => {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowLeft') this.prev();
    if (e.key === 'ArrowRight') this.next();
  };
}
