import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  pipe = new DatePipe('en-US');
  baseUrl: string;
  headers = new BehaviorSubject(null);

  constructor(
  ) {
    this.baseUrl = environment.apiService;
  }

  setLocal() {
    let headers = { 'Content-Type': 'application/json' };
    let token = this.token;
    if (token)
      headers['Authorization'] = `Bearer ${token}`;
    this.headers.next(headers);
  }

  expiredTimeValid(): boolean {
    //ExpiredTime valido
    let sessionSerializada = JSON.parse(localStorage.getItem('usuario'));
    let fechaExpiracion = this.pipe.transform(sessionSerializada.expiredTime, 'dd/MM/yyyy, h:mm:ss a');
    let fechaHoy = this.pipe.transform(Date.now(), 'dd/MM/yyyy, h:mm:ss a');
    console.log(' fechaHoy ', fechaHoy, 'expiredTime ', fechaExpiracion);

    if (fechaExpiracion >= fechaHoy) return true;
    else return false;
  }

  get token() {
    return localStorage.d;
  }
}
