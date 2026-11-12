import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/componentes/footer/footer';

@Component({
  imports: [RouterOutlet, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('country-app');
}
