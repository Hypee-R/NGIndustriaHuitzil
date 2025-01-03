import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CatApartadoModel } from '../models/apartado.model';
import { PagoApartado} from '../models/pagoApartado';
import { ResponseModel } from '../models/response.model';
import { VariablesService } from './variablesGL.service';

@Injectable({
  providedIn: 'root'
})
export class ApartadosService {

  constructor(
    private http: HttpClient,
    private variablesGL: VariablesService
  ) {}


  getApartados(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Apartados/ConsultaAll')
    .pipe(
      map (res => res)
    );
  }

  getApartadosByUbicacion(): Observable<ResponseModel>{

    let sucursal ;

    if(this.variablesGL.getRol()=== 'Administrador' ){
      sucursal="all"
    }else{
      sucursal=this.variablesGL.getSucursal()
    }
    return this.http.get<ResponseModel>(environment.apiService + `Apartados/ConsultaByUbicacion?ubicacion=${sucursal}`)
    .pipe(
      map (res => res)
    );
  }

  getApartadoByUsuario(idUsuario : number,type : string,idApartado:number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Apartados/Consulta/Usuario?idUsuario=${idUsuario}&type=${type}&idApartado=${idApartado}`)
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

  getPagoByApartado(idApartado : number): Observable<ResponseModel>{
     return this.http.get<ResponseModel>(environment.apiService + `PagosApartados/Consulta/Apartado?idApartado=${idApartado}`)
     .pipe(
       map (res => res)
     );
   }

   getPagoByCaja(idCaja : number): Observable<ResponseModel>{
     return this.http.get<ResponseModel>(environment.apiService + `PagosApartados/Consulta/Caja?idCaja=${idCaja}`)
     .pipe(
       map (res => res)
     );
   }

   getArticuloByApartado(idApartado : number): Observable<ResponseModel>{
     return this.http.get<ResponseModel>(environment.apiService + `Apartados/ArticuloByApartado?idApartado=${idApartado}`)
     .pipe(
       map (res => res)
     );
   }

   agregaPago(request: PagoApartado): Observable<ResponseModel>{


     return this.http.post<ResponseModel>(environment.apiService + 'PagosApartados/Agrega', request)
     .pipe(
       map (res => res)
     );
   }

   deletePago(request: PagoApartado): Observable<ResponseModel>{

     return this.http.delete<ResponseModel>(environment.apiService + 'PagosApartados/EliminaPago',  { body: request })
     .pipe(
       map (res => res)
     );
   }

   cancelaApartado(request: CatApartadoModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'Apartados/CancelaApartado', { body: request })
    .pipe(
      map (res => res)
    );
  }


}
