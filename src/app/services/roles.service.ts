import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient
  ){}

  getRoles(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Roles/ConsultaAll')
    .pipe(
      map (res => res)
    );
  }

  agregaRol(newRol: any): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Roles/Agrega', newRol)
    .pipe(
      map (res => res)
    );
  }

  actualizaRol(actualizaRol: any): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Roles/Actualiza', actualizaRol)
    .pipe(
      map (res => res)
    );
  }

  eliminaRol(deleteRol: any): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Roles/Elimina', { body: deleteRol })
    .pipe(
      map (res => res)
    );
  }

}
