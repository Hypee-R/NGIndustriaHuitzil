import { CatTallaModel } from "./tallas.model";
import {formatDate} from '@angular/common';

export class productoModel{
  idArticulo: number;
  status: string;
  existencia: string;
  descripcion: string;
  fechaIngreso: string;
  idUbicacion: number;
  idCategoria: number;
  idTalla:number ;
  talla:string;
  ubicacion:string;
  categoria:string;
  imagen:string;
  precio:number;
  sku: string;
  CantMovimiento? : number
    constructor(){
    this.idArticulo = 0;
    this.status = '';
    this.descripcion = '';
    this.existencia = '';
    this.fechaIngreso= '';
    this.idCategoria = 0;
    this.idTalla =  0;
    this.categoria='';
    this.talla='';
    this.ubicacion='';
    this.imagen='';
    this.precio = 0.00;
    this.sku = '';
    this.CantMovimiento = 0;
  }
}
