import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { CategoriaModel } from '../models/categoria.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(
    private http: HttpClient
  ){}

  getCategorias(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Categorias/ConsultaAll')
    .pipe(
      map (res => res)
    );
  }

  agregacategoria(request: CategoriaModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Categorias/Agregacategoria', request)
    .pipe(
      map (res => res)
    );
  }

  actualizacategoria(request: CategoriaModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Categorias/Actualizacategoria', request)
    .pipe(
      map (res => res)
    );
  }

  eliminacategoria(request: CategoriaModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Categorias/Eliminacategoria', { body: request })
    .pipe(
      map (res => res)
    );
  }

}
