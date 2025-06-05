import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { VariablesService } from './variablesGL.service';
import { CatProduccionCorteModel } from '../models/produccionCorte';
@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  constructor(
    private variablesGL: VariablesService,
    private http: HttpClient
  ){}

  getProduccionCorte(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'ProduccionCortes/Consulta')
    .pipe(
      map (res => res)
    );
  }

  agregaProduccionCorte(request: CatProduccionCorteModel): Observable<ResponseModel>{
    return this.http
      .post<ResponseModel>(environment.apiService + 'ProduccionCortes/Agrega', request)
      .pipe(map((res) => res));
  }

  actualizaProduccionCorte(request: CatProduccionCorteModel): Observable<ResponseModel>{
    return this.http
      .put<ResponseModel>(environment.apiService + 'ProduccionCortes/Actualiza', request)
      .pipe(map((res) => res));
  }
  actualizaArticulosProduccionCorte(request: CatProduccionCorteModel): Observable<ResponseModel>{
    return this.http
      .put<ResponseModel>(environment.apiService + 'ProduccionCortes/ActualizaByOrder', request)
      .pipe(map((res) => res));
  }
  eliminaProduccionCorte(request: CatProduccionCorteModel): Observable<ResponseModel>{
    return this.http
      .delete<ResponseModel>(environment.apiService + 'ProduccionCortes/Elimina', {
        body: request,
      })
      .pipe(map((res) => res));
  }

  getArticuloByOrder(order : number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'ProduccionCortes/ProductosByOrder?order='+order)
    .pipe(
      map (res => res)
    );
  }

  getMaterialesByOrder(order : number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'ProduccionCortes/MaterialesByOrder?order='+order)
    .pipe(
      map (res => res)
    );
  }
}
