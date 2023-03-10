export class CatApartadoModel{
    idApartado: number;
    idEmpleado: number;
    idArticulo : number;
    idTalla : number;
    fecha: string;
    fechaEntrega: string;
    telefono : string;
    direccion : string;
    status : string;
    articulo: string;
    talla :string;
    constructor(){
        this.idApartado = 0
        this.idEmpleado = 0
        this.idArticulo = 0
        this.idTalla = 0
        this.fecha = ''
        this.telefono = ""
        this.direccion = ""
        this.status = ""
        this.articulo = ""
        this.talla = ""
    }
  }
  