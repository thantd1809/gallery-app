import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class Gallery implements OnInit {
  categories: string[] = [];
  images: { [key: string]: string[] } = {};

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Only load JSON in the browser, not during SSR/prerender
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<{ [key: string]: string[] }>('assets/gallery.json')
        .subscribe({
          next: (data) => {
            this.images = data;
            this.categories = Object.keys(data);
            console.log('✅ Loaded gallery.json', data);
          },
          error: (err) => {
            console.error('❌ Failed to load gallery.json', err);
          }
        });
    }
  }
}
