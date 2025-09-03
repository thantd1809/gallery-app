import { Component } from '@angular/core';
import { Gallery } from './components/gallery/gallery';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Gallery],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Gallery';
}
