import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';

import { Producto } from '../producto.model';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css'
})
export class ListaProductos {

  readonly productos = httpResource<Producto[]>(
    () => '/api/productos'
  );
}
