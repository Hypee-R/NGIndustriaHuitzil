import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

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

  get token() {
    return localStorage.d;
  }
}
