import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CatApartadoModel } from '../models/apartado.model';
import { PagoApartado} from '../models/pagoApartado';
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

  getApartadoByUsuario(idUsuario : number,type : string,idApartado:number): Observable<ResponseModel>{
   // let sucursal = this.variablesGL.getSucursal() ?? "all";
    return this.http.get<ResponseModel>(environment.apiService + `Apartados/Consulta/Usuario?idUsuario=${idUsuario}&type=${type}&idApartado${idApartado}`)
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
    // let sucursal = this.variablesGL.getSucursal() ?? "all";
     return this.http.get<ResponseModel>(environment.apiService + `PagosApartados/Consulta/Apartado?idApartado=${idApartado}`)
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
}
