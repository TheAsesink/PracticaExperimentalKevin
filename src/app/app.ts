import { Component } from '@angular/core';

import { ListaProductos } from './lista-productos/lista-productos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ListaProductos
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'PracticaExperimental';
}
