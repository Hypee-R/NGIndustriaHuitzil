import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { CajaModel } from '../models/caja.model';
import { CambiosDevolucionesModel } from '../models/cambios-devoluciones.model';
import { VentaModel } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  user = JSON.parse(localStorage.getItem('usuario'));
  constructor(
    private http: HttpClient
  ){}

  getVentas(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Ventas/Sales')
    .pipe(
      map (res => res)
    );
  }
  getCaja(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/Cash/Consulta?param=${this.user.id}`)
    .pipe(
      map (res => res)
    );
  }

  openCaja(request: CajaModel): Observable<ResponseModel>{
    request.idEmpleado = this.user.id;
    return this.http.post<ResponseModel>(environment.apiService + 'Ventas/Cash/Abrir', request)
    .pipe(
      map (res => res)
    );
  }

  closeCaja(request: CajaModel): Observable<ResponseModel>{
    request.idEmpleado = this.user.id;
    return this.http.put<ResponseModel>(environment.apiService + 'Ventas/Cash/Cerrar', request)
    .pipe(
      map (res => res)
    );
  }

  searchVentaByNoTicket(noTicket: string): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/Returns/SearchSale?noTicket=${noTicket}`)
    .pipe(
      map (res => res)
    );
  }

  getCambiosDevoluciones(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/Returns/Consulta`)
    .pipe(
      map (res => res)
    );
  }

  postCambiosDevoluciones(request: CambiosDevolucionesModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Ventas/Returns/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  putCambiosDevoluciones(request: CambiosDevolucionesModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'Ventas/Returns/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }


  postRegistroVenta(request: VentaModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'Ventas/Sales/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

}
