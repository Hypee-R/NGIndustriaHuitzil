import Swal from 'sweetalert2'
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  showSideUser = new Subject<boolean>();
  showSideBar = new Subject<boolean>();
  changeTipoMenu = new Subject<boolean>();
  showDialog = new BehaviorSubject<boolean>(false);

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
    //this.router.navigate(['/'], { replaceUrl: true });
    localStorage.d = "";
    localStorage.clear();
    location.reload();
  }

  changeTheme(darkTheme: boolean){
    localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
  }

  getSHA1(data: string){
    return CryptoJS.SHA1(data).toString()
  }

  checkPassword(group: FormGroup): any {
    const pass = group.controls.password?.value;
    const confirmPassword = group.controls.repetirPassword?.value;
    return pass === confirmPassword ? null : { notSame: true };
  }

  showLoading(){
    Swal.fire({
      title: 'Por favor espera...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  hideLoading(){
    Swal.close();
  }

}
