import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { CajaModel } from '../models/caja.model';
import { CambiosDevolucionesModel } from '../models/cambios-devoluciones.model';
import { VentaModel } from '../models/venta.model';
import { VariablesService } from './variablesGL.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  user = JSON.parse(localStorage.getItem('usuario'));
  constructor(   private variablesGL: VariablesService,
    private http: HttpClient
  ){}

  getallCajas():Observable<ResponseModel>{
    console.log(this.variablesGL.getRol)
    let sucursal ;
    if(this.variablesGL.getRol()=== 'Administrador' ){
      sucursal="all"
    }else{
      sucursal=this.variablesGL.getSucursal()
    }
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/Cash/Cajas?sucursal=${sucursal}`)
    .pipe(
      map (res => res)
    );
  }

  getallVentasCajasDate(dateI:String,dateF : String):Observable<ResponseModel>{
    let sucursal ;
    if(this.variablesGL.getRol()=== 'Administrador' ){
      sucursal="all"
    }else{
      sucursal=this.variablesGL.getSucursal()
    }
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/Cash/CajasDate?dateI=${dateI}&dateF=${dateF}&sucursal=${sucursal}`)
    .pipe(
      map (res => res)
    );
  }

  getVentas(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'Ventas/Sales')
    .pipe(
      map (res => res)
    );
  }

  getVentasByCaja(idCaja : number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/SalesByCajas?idCaja=${idCaja}`)
    .pipe(
      map (res => res)
    );
  }

  getVentasByDates(dateI:String,dateF : String): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/SalesByDates?dateI=${dateI}&&dateF=${dateF}`)
    .pipe(
      map (res => res)
    );
  }
  getCaja(): Observable<ResponseModel>{
    //console.log(this.user)
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
  postCancelacion(request: VentaModel): Observable<ResponseModel>{
    console.log(request)
    return this.http.post<ResponseModel>(environment.apiService + 'Ventas/sales/cancela', request)
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
    console.log(request);
    return this.http.post<ResponseModel>(environment.apiService + 'Ventas/Sales/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

}
