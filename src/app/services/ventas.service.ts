import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { CajaModel } from '../models/caja.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  user = JSON.parse(localStorage.getItem('usuario'));
  constructor(
    private http: HttpClient
  ){}

  getCaja(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Ventas/GetCash?param=${this.user.id}`)
    .pipe(
      map (res => res)
    );
  }

  openCaja(request: CajaModel): Observable<ResponseModel>{
    request.idEmpleado = this.user.id;
    return this.http.post<ResponseModel>(environment.apiService + 'Ventas/OpenCash', request)
    .pipe(
      map (res => res)
    );
  }

  closeCaja(request: CajaModel): Observable<ResponseModel>{
    request.idEmpleado = this.user.id;
    return this.http.put<ResponseModel>(environment.apiService + 'Ventas/CloseCash', request)
    .pipe(
      map (res => res)
    );
  }

}
