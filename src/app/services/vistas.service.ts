import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../models/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VistasService {

  constructor(
    private http: HttpClient
  ){}

  getVistas(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Vistas/ConsultaAll')
    .pipe(
      map (res => res)
    );
  }

  getVistasRoles(idRol: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Vistas/ConsultaAllVR?idRol=${idRol}`)
    .pipe(
      map (res => res)
    );
  }

  agregaVistaRol(newVistaRol: any): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Vistas/AgregaVR', newVistaRol)
    .pipe(
      map (res => res)
    );
  }

  actualizaVistaRol(actualizaRol: any): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Vistas/ActualizaVR', actualizaRol)
    .pipe(
      map (res => res)
    );
  }

  eliminaVistaRol(deleteVistaRol: any): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Vistas/EliminaVR', { body: deleteVistaRol })
    .pipe(
      map (res => res)
    );
  }

}
