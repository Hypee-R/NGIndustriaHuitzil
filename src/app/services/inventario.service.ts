import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../models/response.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { productoModel } from '../models/productos.model.';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }

  getArticulos(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Inventario/Consulta')
    .pipe(
      map (res => res)
    );
    
  }

  agregaArticulo(request:productoModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Inventario/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaArticulo(request: productoModel): Observable<ResponseModel>{
    console.log(request)
    return this.http.put<ResponseModel>(environment.apiService + 'Inventario/Actualiza', request)
    .pipe(
      map (res => res)
    );

  }

  eliminaArticulo(request: productoModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Inventario/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }


}


