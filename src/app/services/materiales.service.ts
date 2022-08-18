import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { MaterialesModel } from '../models/materiales.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  constructor(
    private http: HttpClient
  ){}

  getMateriales(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Materiales/Consulta')
    .pipe(
      map (res => res)
    );
  }

  agregaMaterial(request: MaterialesModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Materiales/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaMaterial(request: MaterialesModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Materiales/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }

  eliminaMaterial(request: MaterialesModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Materiales/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }

}
