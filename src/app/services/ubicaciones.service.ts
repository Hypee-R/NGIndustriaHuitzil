import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
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

  // agregaRol(newRol: any): Observable<ResponseModel>{
  //   return this.http.post<ResponseModel>(environment.apiService + 'Roles/Agrega', newRol)
  //   .pipe(
  //     map (res => res)
  //   );
  // }

  // actualizaRol(actualizaRol: any): Observable<ResponseModel>{
  //   return this.http.post<ResponseModel>(environment.apiService + 'Roles/Actualiza', actualizaRol)
  //   .pipe(
  //     map (res => res)
  //   );
  // }

  // eliminaRol(deleteRol: any): Observable<ResponseModel>{
  //   return this.http.post<ResponseModel>(environment.apiService + 'Roles/Elimina', deleteRol)
  //   .pipe(
  //     map (res => res)
  //   );
  // }

}
