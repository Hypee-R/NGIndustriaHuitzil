import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  showSideUser = new Subject<boolean>();
  showSideBar = new Subject<boolean>();
  changeTipoMenu = new Subject<boolean>();

  constructor(
    private router: Router
  ) {
  }

  getStatusPantalla(): number {
    let width = window.screen.width;

    if (width < 640) return 1;
    else if (width > 640 && width < 769) return 10;
    else return 17;
  }

  getPantalla(): string {
    let width = window.screen.width;
    if (width < 768) return 'celular';
    else if (width > 768 && width <= 1200) return 'tablet';
    else if (width > 1200 && width < 1920 ) return 'laptop';
    else if(width >= 1920)return 'monitor';
  }

  removeCredential() {
    this.router.navigate(['/'], { replaceUrl: true });
    localStorage.d = "";
    localStorage.clear();
    location.reload();
  }

  changeTheme(darkTheme: boolean){
    localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
  }

}
