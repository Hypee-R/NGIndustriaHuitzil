import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';
import { ResponseModel } from '../models/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ){}

  getDashboard(year: string, idSucursal: number){
    return forkJoin ({
      cards: this.getCards(year, idSucursal),
      chartBar: this.getChartBar(year, idSucursal),
      rankingArticles: this.getRankingArticles(year, idSucursal),
      rankingEmpleados: this.getRankingEmpleados(year, idSucursal),
      rankingSucursales: this.getRankingSucursales(year),
    });
  }

  getCards(year: string, idSucursal: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/Cards?year=${year}&idSucursal=${idSucursal}`)
    .pipe(
      map (res => res)
    );
  }

  getChartBar(year: string, idSucursal: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/ChartBar?year=${year}&idSucursal=${idSucursal}`)
    .pipe(
      map (res => res)
    );
  }

  getRankingArticles(year: string, idSucursal: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/RankingArticles?year=${year}&idSucursal=${idSucursal}`)
    .pipe(
      map (res => res)
    );
  }

  getRankingEmpleados(year: string, idSucursal: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/RankingEmpleados?year=${year}&idSucursal=${idSucursal}`)
    .pipe(
      map (res => res)
    );
  }

  getRankingSucursales(year: string): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/RankingSucursales?year=${year}`)
    .pipe(
      map (res => res)
    );
  }

}
