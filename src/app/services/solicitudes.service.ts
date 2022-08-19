import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { SolicitudesMaterialModel } from '../models/solicitudes.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(
    private http: HttpClient
  ){}

  getSolicitudes(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'SolicitudesMateriales/Consulta')
    .pipe(
      map (res => res)
    );
  }

  getProveedoresMateriales(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + 'SolicitudesMateriales/ConsultaProvMat')
    .pipe(
      map (res => res)
    );
  }

  agregaSolicitud(request: SolicitudesMaterialModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(environment.apiService + 'SolicitudesMateriales/Agrega', request)
    .pipe(
      map (res => res)
    );
  }

  actualizaSolicitud(request: SolicitudesMaterialModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(environment.apiService + 'SolicitudesMateriales/Actualiza', request)
    .pipe(
      map (res => res)
    );
  }

  eliminaSolicitud(request: SolicitudesMaterialModel): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(environment.apiService + 'SolicitudesMateriales/Elimina', { body: request })
    .pipe(
      map (res => res)
    );
  }

}
