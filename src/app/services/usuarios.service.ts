import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/response.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ){}

  getUsuarios(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Usuarios/Consulta')
    .pipe(
      map (res => res)
    );
  }

  agregaUsuario(request: UsuarioModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Usuarios/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaUsuario(request: UsuarioModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Usuarios/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }

  updatePassword(idUser: number, newPassword: string): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Usuarios/ActualizaPsw', {idUser, newPassword})
    .pipe(
      map (res => res)
    );
  }

  eliminaUsuario(request: UsuarioModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Usuarios/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }

}
