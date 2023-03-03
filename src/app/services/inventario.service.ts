import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../models/response.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { productoModel } from '../models/productos.model';
import { VariablesService } from './variablesGL.service';
import { ResponseModelImprime } from '../models/responseImprime.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(
    private http: HttpClient,
    private variablesGL: VariablesService) { }

    getImprimirEtiquetas(Descripcion: string,sku: string,cantidad: number): Observable<ResponseModelImprime>{
      return this.http.get<ResponseModelImprime>(`http://127.0.0.1:5000/imprime?sku=${sku}&descripcion=${Descripcion}&cantidad=${cantidad}`).pipe(
        map (res => res)
      );
    }

  getArticulos(): Observable<ResponseModel>{
    let sucursal = this.variablesGL.getSucursal() ?? "all";
    return this.http.get<ResponseModel>(environment.apiService + `Inventario/Consulta?sucursal=${sucursal}`)
    .pipe(
      map (res => res)
    );

  }

  getInexistencias(): Observable<ResponseModel>{
    let sucursal = this.variablesGL.getSucursal() ?? "all";
    return this.http.get<ResponseModel>(environment.apiService + `Inventario/Inexistencias?sucursal=${sucursal}`)
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

  searchProduct(queryString: string): Observable<ResponseModel> {
    let sucursal = this.variablesGL.getSucursal() ?? "all";
    return this.http.get<ResponseModel>(environment.apiService + `Inventario/SearchProduct?queryString=${queryString}&sucursal=${sucursal}`);
  }


}


