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
    // console.log(localStorage.getItem('rol'))
    return localStorage.getItem('sucursal');
  }

  setSucursal(value: string){
    localStorage.removeItem('sucursal');
    localStorage.setItem('sucursal', value);
  }

  setRol(value: string){
    localStorage.removeItem('rol');
    localStorage.setItem('rol', value);
  }

  getRol(){
    return localStorage.getItem('rol');
  }

  setFormatoFecha(fecha: string | Date){
    return this.datePipe.transform(fecha,'dd/MM/yyyy hh:mm:ss a');
  }

  getFormatoFecha(fecha: string): Date {
    console.log('fecha ', fecha);

    const [dateComponents, timeComponents, ap, mm] = fecha.split(' ');

    const [day, month, year] = dateComponents.split('/');
    const [hours, minutes, seconds] = timeComponents.split(':');

    let hora = Number.parseInt(hours);

    // PM
    if (ap?.includes('p')) {
        if (hora !== 12) {
            hora = hora + 12;
        }
    }
    // AM
    else if (ap?.includes('a')) {
        if (hora === 12) {
            hora = hora - 12;
        }
    }

    return new Date(+year, +month - 1, +day, hora, +minutes, +seconds);
}
numeroALetras(num, currency) {
  currency = currency || {};
  let data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
    letrasCentavos: '',
    letrasMonedaPlural: currency.plural || 'PESOS MEXICANOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
    letrasMonedaSingular: currency.singular || 'PESO MEXICANO', //'PESO', 'Dólar', 'Bolivar', 'etc'
    letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVO PESOS MEXICANOS',
    letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVO PESO MEXICANO'
  };

  if (data.centavos > 0) {
    let centavos = ''
    if (data.centavos == 1)
      centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
    else
      centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
    data.letrasCentavos = 'CON ' + centavos
  };

  if (data.enteros == 0)
    return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  if (data.enteros == 1)
    return this.Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
  else
    return this.Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
};

 //Funcion Para Generar el Numero en letras del total de la compra
 Unidades(num) {
  switch (num) {
    case 1: return 'UN';
    case 2: return 'DOS';
    case 3: return 'TRES';
    case 4: return 'CUATRO';
    case 5: return 'CINCO';
    case 6: return 'SEIS';
    case 7: return 'SIETE';
    case 8: return 'OCHO';
    case 9: return 'NUEVE';
  }

  return '';
}//Unidades()

Decenas(num) {

  let decena = Math.floor(num / 10);
  let unidad = num - (decena * 10);

  switch (decena) {
    case 1:
      switch (unidad) {
        case 0: return 'DIEZ';
        case 1: return 'ONCE';
        case 2: return 'DOCE';
        case 3: return 'TRECE';
        case 4: return 'CATORCE';
        case 5: return 'QUINCE';
        default: return 'DIECI' + this.Unidades(unidad);
      }
    case 2:
      switch (unidad) {
        case 0: return 'VEINTE';
        default: return 'VEINTI' + this.Unidades(unidad);
      }
    case 3: return this.DecenasY('TREINTA', unidad);
    case 4: return this.DecenasY('CUARENTA', unidad);
    case 5: return this.DecenasY('CINCUENTA', unidad);
    case 6: return this.DecenasY('SESENTA', unidad);
    case 7: return this.DecenasY('SETENTA', unidad);
    case 8: return this.DecenasY('OCHENTA', unidad);
    case 9: return this.DecenasY('NOVENTA', unidad);
    case 0: return this.Unidades(unidad);
  }
}//Unidades()

DecenasY(strSin, numUnidades) {
  if (numUnidades > 0)
    return strSin + ' Y ' + this.Unidades(numUnidades)

  return strSin;
}//DecenasY()

Centenas(num) {
  let centenas = Math.floor(num / 100);
  let decenas = num - (centenas * 100);

  switch (centenas) {
    case 1:
      if (decenas > 0)
        return 'CIENTO ' + this.Decenas(decenas);
      return 'CIEN';
    case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
    case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
    case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
    case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
    case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
    case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
    case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
    case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
  }

  return this.Decenas(decenas);
}//Centenas()

Seccion(num, divisor, strSingular, strPlural) {
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)

  let letras = '';

  if (cientos > 0)
    if (cientos > 1)
      letras = this.Centenas(cientos) + ' ' + strPlural;
    else
      letras = strSingular;

  if (resto > 0)
    letras += '';

  return letras;
}//Seccion()

Miles(num) {
  let divisor = 1000;
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)

  let strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
  let strCentenas = this.Centenas(resto);

  if (strMiles == '')
    return strCentenas;

  return strMiles + ' ' + strCentenas;
}//Miles()

Millones(num) {
  let divisor = 1000000;
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)

  let strMillones = this.Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
  let strMiles = this.Miles(resto);

  if (strMillones == '')
    return strMiles;

  return strMillones + ' ' + strMiles;
}//Millones()
  // getFormatoFecha(fecha: string){
  //   console.log('fecha ', fecha);

  //   const [dateComponents, timeComponents, ap, mm] = fecha.split(' ');

  //   // console.log(dateComponents); // 👉️ "07/21/2024"
  //   // console.log(timeComponents); // 👉️ "04:24:37"
  //   console.log(ap); // 👉️ "a. p."
  //   // console.log(mm); // 👉️ "m. m."
  //   const [month, day, year] = dateComponents.split('/');
  //   const [hours, minutes, seconds] = timeComponents.split(':');

  //   let hora = 0;
  //   hora = Number.parseInt(hours);
  //   //PM
  //   if(ap?.includes('p')){
  //     if(Number.parseInt(hours) != 12){
  //       hora = Number.parseInt(hours)+12;
  //     }else{
  //       hora = Number.parseInt(hours);
  //     }
  //   }
  //   //AM
  //   else if(ap?.includes('a')){
  //     if(Number.parseInt(hours) != 12){
  //       hora = Number.parseInt(hours);
  //     }else{
  //       hora = Number.parseInt(hours)-12;
  //     }
  //   }

  //   // console.log(hora);

  //   return new Date(+year, +month - 1, +day, +hora, +minutes, +seconds);
  // }

}
