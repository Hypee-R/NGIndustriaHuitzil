import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { CatTallaModel } from '../models/tallas.model';

@Injectable({
  providedIn: 'root'
})
export class TallasService {

  constructor(
    private http: HttpClient
  ){}

  getTallas(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Tallas/Consulta')
    .pipe(
      map (res => res)
    );
  }

  agregaTalla(request: CatTallaModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Tallas/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaTalla(request: CatTallaModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Tallas/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }

  eliminaTalla(request: CatTallaModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Tallas/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }

}
