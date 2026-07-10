import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';

import { Producto } from '../producto.model';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule
  ],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css'
})
export class ListaProductos {

  private readonly productoService = inject(ProductoService);

  readonly productos = httpResource<Producto[]>(
    () => '/api/productos'
  );

  nombre = '';
  precio: number | null = null;
  disponible = true;

  readonly guardando = signal(false);
  readonly eliminandoId = signal<number | null>(null);
  readonly mensajeExito = signal('');
  readonly mensajeError = signal('');

  guardarProducto(): void {
    this.mensajeExito.set('');
    this.mensajeError.set('');

    const nombreLimpio = this.nombre.trim();

    if (!nombreLimpio) {
      this.mensajeError.set('El nombre del producto es obligatorio.');
      return;
    }

    if (this.precio === null || this.precio <= 0) {
      this.mensajeError.set('El precio debe ser mayor que cero.');
      return;
    }

    const nuevoProducto: Omit<Producto, 'id'> = {
      nombre: nombreLimpio,
      precio: this.precio,
      disponible: this.disponible
    };

    this.guardando.set(true);

    this.productoService.crear(nuevoProducto).subscribe({
      next: () => {
        this.mensajeExito.set('Producto creado correctamente.');
        this.limpiarFormulario();
        this.productos.reload();
        this.guardando.set(false);
      },
      error: () => {
        this.mensajeError.set(
          'No se pudo crear el producto. Verifica que la API esté funcionando.'
        );
        this.guardando.set(false);
      }
    });
  }

  eliminarProducto(producto: Producto): void {
    this.mensajeExito.set('');
    this.mensajeError.set('');

    const confirmar = window.confirm(
      `¿Deseas eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.eliminandoId.set(producto.id);

    this.productoService.eliminar(producto.id).subscribe({
      next: () => {
        this.mensajeExito.set('Producto eliminado correctamente.');
        this.productos.reload();
        this.eliminandoId.set(null);
      },
      error: () => {
        this.mensajeError.set(
          'No se pudo eliminar el producto.'
        );
        this.eliminandoId.set(null);
      }
    });
  }

  private limpiarFormulario(): void {
    this.nombre = '';
    this.precio = null;
    this.disponible = true;
  }
}

