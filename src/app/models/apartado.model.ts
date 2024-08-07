import { ApartadoArticuloModel } from "./apartadoArticulo.model";

export class CatApartadoModel{
    idApartado: number;
    idCliente:number;
    idParent: number;
    fecha: Date;
    fechaEntrega: string;
    telefono : string;
    ubicacion:string;
    status : string;
    precio : number;
    total :number;
    resto:number
    type : string;
    noTicket:string;
    articulosApartados: ApartadoArticuloModel[];
    constructor(){
        this.idApartado = 0
        this.idParent = 0
        this.telefono = ""
        this.status = ""
        this.precio  = 0
        this.type = "",
        this.noTicket=""
    }
  }
