import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CatClienteModel } from '../models/clientes.model';
import { ResponseModel } from '../models/response.model';
import { VariablesService } from './variablesGL.service';
@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private variablesGL: VariablesService,
    private http: HttpClient
  ){}

  getClientes(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Clientes/Consulta')
    .pipe(
      map (res => res)
    );
  }

  getClientesBySucursal(): Observable<ResponseModel>{
    let sucursal ;
    if(this.variablesGL.getSucursal()== null || this.variablesGL.getSucursal()== "null" ||this.variablesGL.getSucursal()== undefined){
      sucursal="all"
    }else{
      sucursal=this.variablesGL.getSucursal()
    }

    return this.http.get<ResponseModel>(environment.apiService +  `Clientes/ConsultaSucursal?sucursal=${sucursal}`)
    .pipe(
      map (res => res)
    );
  }

  agregaCliente(request: CatClienteModel): Observable<ResponseModel>{
    console.log(request)
    return this.http.post<ResponseModel>(environment.apiService + 'Clientes/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaCliente(request: CatClienteModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Clientes/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }

  eliminaCliente(request: CatClienteModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Clientes/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }

}
