import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

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

  categories$ = new BehaviorSubject<string[]>([]);
  images$ = new BehaviorSubject<{ [key: string]: string[] }>({});

  ngOnInit(): void {
    // Only load JSON in browser
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<{ [key: string]: string[] }>('assets/gallery.json')
        .subscribe({
          next: (data) => {
            this.images$.next(data);
            this.categories$.next(Object.keys(data));
            console.log('✅ Loaded gallery.json', data);
          },
          error: (err) => console.error('❌ Failed to load gallery.json', err)
        });
    }
  }
}
