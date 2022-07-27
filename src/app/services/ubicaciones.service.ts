import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { UbicacionModel } from '../models/ubicacion.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(
    private http: HttpClient
  ){}

  getUbicaciones(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Ubicaciones/ConsultaAll')
    .pipe(
      map (res => res)
    );
  }

  agregaUbicacion(request: UbicacionModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Ubicaciones/AgregaUbicacion', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaUbicacion(request: UbicacionModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Ubicaciones/ActualizaUbicacion', request)
    .pipe(
      map (res => res)
    );
  }

  eliminaUbicacion(request: UbicacionModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Ubicaciones/EliminaUbicacion', { body: request })
    .pipe(
      map (res => res)
    );
  }

}
