import { ApartadoArticuloModel } from "./apartadoArticulo.model";

export class CatApartadoModel{
    idApartado: number;
    //idEmpleado: number;
    idCliente:number;
    //idArticulo : number;
    //idTalla : number;
    idParent: number;
    fecha: Date;
    fechaEntrega: string;
    telefono : string;
    //direccion : string;
    status : string;
    //articulo: string;
    //talla :string;
    precio : number;
    total :number;
    resto:number
    type : string;
    articulosApartados: ApartadoArticuloModel[];
    constructor(){
        this.idApartado = 0
        this.idParent = 0
        this.telefono = ""
        this.status = ""
        this.precio  = 0
        this.type = ""
    }
  }
  