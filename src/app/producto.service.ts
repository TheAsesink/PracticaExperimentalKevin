import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  catchError,
  Observable,
  throwError
} from 'rxjs';

import { Producto } from './producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/productos';

  listar(): Observable<Producto[]> {
    return this.http
      .get<Producto[]>(this.baseUrl)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.manejarError(error)
        )
      );
  }

  obtener(id: number | string): Observable<Producto> {
    return this.http
      .get<Producto>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.manejarError(error)
        )
      );
  }

  crear(
    producto: Omit<Producto, 'id'>
  ): Observable<Producto> {
    return this.http
      .post<Producto>(this.baseUrl, producto)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.manejarError(error)
        )
      );
  }

  actualizar(
    id: number | string,
    producto: Producto
  ): Observable<Producto> {
    return this.http
      .put<Producto>(
        `${this.baseUrl}/${id}`,
        producto
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.manejarError(error)
        )
      );
  }

  eliminar(id: number | string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.manejarError(error)
        )
      );
  }

  private manejarError(
    error: HttpErrorResponse
  ): Observable<never> {

    if (error.status === 0) {
      console.error(
        'Sin conexión de red o bloqueo por CORS.'
      );
    } else if (error.status === 400) {
      console.error('Solicitud incorrecta.');
    } else if (error.status === 404) {
      console.error('Recurso no encontrado.');
    } else if (error.status >= 500) {
      console.error('Error interno del servidor.');
    } else {
      console.error(
        `Error HTTP ${error.status}.`
      );
    }

    return throwError(() => error);
  }
}
