// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private manifestUrl = '/assets/images.json';

  constructor(private http: HttpClient) {}

  /**
   * Load manifest and return object where each category maps to full asset URLs:
   * { less: ['/assets/less/less001.jpg', ...], ... }
   */
  loadManifest(): Observable<Record<string, string[]>> {
    return this.http.get<Record<string, string[]>>(this.manifestUrl).pipe(
      map(manifest => {
        const out: Record<string, string[]> = {};
        for (const key of Object.keys(manifest || {})) {
          out[key] = (manifest[key] || []).map(fname => `/assets/${key}/${fname}`);
        }
        return out;
      })
    );
  }
}
