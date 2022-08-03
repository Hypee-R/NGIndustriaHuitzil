import { CatTallaModel } from "./tallas.model";

export class productoModel{
  idArticulo: number;
  unidad: string;
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
    constructor(){
    this.idArticulo = 0;
    this.unidad = '';
    this.descripcion = '';
    this.existencia = '';
    this.fechaIngreso= '';
    this.idCategoria = 0;
    this.idTalla =  0;
    this.categoria='';
    this.talla='';
    this.ubicacion='';
    this.imagen=''
  }
}
