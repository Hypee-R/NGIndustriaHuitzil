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

  getDashboard(){
    return forkJoin ({
      cards: this.getCards(),
      chartBar: this.getChartBar(),
      rankingArticles: this.getRankingArticles(),
      rankingEmpleados: this.getRankingEmpleados(),
      rankingSucursales: this.getRankingSucursales(),
    });
  }

  getCards(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/Cards?idSucursal=${1}`)
    .pipe(
      map (res => res)
    );
  }

  getChartBar(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/ChartBar?idSucursal=${1}`)
    .pipe(
      map (res => res)
    );
  }

  getRankingArticles(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/RankingArticles`)
    .pipe(
      map (res => res)
    );
  }

  getRankingEmpleados(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/RankingEmpleados`)
    .pipe(
      map (res => res)
    );
  }

  getRankingSucursales(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(environment.apiService + `Dashboard/RankingSucursales`)
    .pipe(
      map (res => res)
    );
  }

}
