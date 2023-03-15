export class PagoApartado{
    //idApartado: number;
    //idEmpleado: number;
    IdPagoApartado : number
    idApartado : number
    idArticulo : number
    fecha: string;
    fechaEntrega: string;
    status : string;
    cantidad : number;
    constructor(){
        this.idApartado = 0
        this.idArticulo = 0
        this.fecha = ''
        this.status = ""
        this.cantidad  = 0
    }
  }
  