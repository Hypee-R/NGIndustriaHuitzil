import Swal from 'sweetalert2'
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  showSideUser = new Subject<boolean>();
  showSideBar = new Subject<boolean>();
  changeTipoMenu = new Subject<boolean>();
  showDialog = new BehaviorSubject<boolean>(false);

  datePipe = new DatePipe("en-US");
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
    this.router.navigate(['/login'], { replaceUrl: true });
    localStorage.d = "";
    localStorage.clear();
    //location.reload();
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

    if(pass.length > 6){
      return pass === confirmPassword ? null : { notSame: true };
    }else{
      return { notSame: true }
    }
  }

  showLoading(){
    Swal.fire({
      title: 'Por favor espera...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }

  hideLoading(){
    Swal.close();
  }

  getSucursal(){
    return localStorage.getItem('sucursal');
  }

  setSucursal(value: string){
    localStorage.removeItem('sucursal');
    localStorage.setItem('sucursal', value);
  }

  setFormatoFecha(fecha: string | Date){
    return this.datePipe.transform(fecha,'dd/MM/yyyy hh:mm:ss a');
  }

  getFormatoFecha(fecha: string){
    console.log('fecha ', fecha);

    const [dateComponents, timeComponents, ap, mm] = fecha.split(' ');

    // console.log(dateComponents); // 👉️ "07/21/2024"
    // console.log(timeComponents); // 👉️ "04:24:37"
    console.log(ap); // 👉️ "a. p."
    // console.log(mm); // 👉️ "m. m."
    const [day, month, year] = dateComponents.split('/');
    const [hours, minutes, seconds] = timeComponents.split(':');

    let hora = 0;
    hora = Number.parseInt(hours);
    //PM
    if(ap?.includes('p')){
      if(Number.parseInt(hours) != 12){
        hora = Number.parseInt(hours)+12;
      }else{
        hora = Number.parseInt(hours);
      }
    }
    //AM
    else if(ap?.includes('a')){
      if(Number.parseInt(hours) != 12){
        hora = Number.parseInt(hours);
      }else{
        hora = Number.parseInt(hours)-12;
      }
    }

    // console.log(hora);

    return new Date(+year, +month - 1, +day, +hora, +minutes, +seconds);
  }

}
