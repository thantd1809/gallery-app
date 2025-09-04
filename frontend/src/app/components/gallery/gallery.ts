import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/core';

const GALLERY_DATA = makeStateKey<{ [key: string]: string[] }>('gallery-data');

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css'],
})
export class Gallery implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private state = inject(TransferState);

  categories: string[] = [];
  images: { [key: string]: string[] } = {};

  ngOnInit(): void {
    // Nếu SSR: lấy data và lưu vào TransferState
    if (isPlatformServer(this.platformId)) {
      this.http.get<{ [key: string]: string[] }>('assets/gallery.json')
        .subscribe(data => {
          this.images = data;
          this.categories = Object.keys(data);
          this.state.set(GALLERY_DATA, data); // 🔹 save vào TransferState
          console.log('✅ SSR preload gallery.json');
        });
    }

    // Nếu client: đọc lại TransferState, tránh fetch lại
    if (isPlatformBrowser(this.platformId)) {
      const savedData = this.state.get(GALLERY_DATA, null as any);
      if (savedData) {
        this.images = savedData;
        this.categories = Object.keys(savedData);
        console.log('✅ Loaded from TransferState');
      } else {
        // fallback nếu không có data (rare case)
        this.http.get<{ [key: string]: string[] }>('assets/gallery.json')
          .subscribe(data => {
            this.images = data;
            this.categories = Object.keys(data);
          });
      }
    }
  }
}
