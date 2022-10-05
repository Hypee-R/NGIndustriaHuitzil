import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CatProveedorModel } from '../models/proveedores.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(
    private http: HttpClient
  ){}

  getProveedores(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Proveedores/Consulta')
    .pipe(
      map (res => res)
    );
  }

  agregaProveedor(request: CatProveedorModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Proveedores/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaProveedor(request: CatProveedorModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Proveedores/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }

  eliminaProveedor(request: CatProveedorModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Proveedores/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }

  searchCliente(queryString: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(environment.apiService + `Proveedores/searchCliente?queryString=${queryString}`)
  }


}
