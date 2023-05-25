import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { MovimientosInventarioModel } from '../models/movimientos-inventario.model';


@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  user = JSON.parse(localStorage.getItem('usuario'));
  constructor(
    private http: HttpClient
  ){}
  
  getallMovimientos():Observable<ResponseModel>{
 
    return this.http.get<ResponseModel>(environment.apiService + 'Movimientos/Movimientos')
    .pipe(
      map (res => res)
    );
  }

  addMovimiento(request:MovimientosInventarioModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Movimientos/Add',request)
    .pipe(
      map (res => res)
    );
  }
  cerrarMovimiento(request:MovimientosInventarioModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Movimientos/cerrar',request)
    .pipe(
      map (res => res)
    );
  }

}
