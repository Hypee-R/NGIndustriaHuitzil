import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CatApartadoModel } from '../models/apartado.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ApartadosService {

  constructor(
    private http: HttpClient
  ) {}

  
  getApartados(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Apartados/ConsultaAll')
    .pipe(
      map (res => res)
    );
  }

  getApartadoByUsuario(idUsuario : number): Observable<ResponseModel>{
   // let sucursal = this.variablesGL.getSucursal() ?? "all";
    return this.http.get<ResponseModel>(environment.apiService + `Apartados/Consulta/Usuario?idUsuario=${idUsuario}`)
    .pipe(
      map (res => res)
    );
  }

  agregaApartado(request: CatApartadoModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Apartados/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaApartado(request: CatApartadoModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Apartados/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }

  /*eliminaCliente(request: CatClienteModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Clientes/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }*/
}
