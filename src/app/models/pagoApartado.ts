export class PagoApartado{
    IdPagoApartado : number
    idApartado : number
    idCaja: number
    fecha:  Date;
    fechaEntrega: string;
    cantidad : number;
    tipoPago:string;
    tipoPagoValida:string;
    montoTarjeta : number;
    montoEfectivo : number;
    noTicketPago:string
    constructor(){
        this.idApartado = 0
        this.fecha = new Date
        this.cantidad  = 0
    }
  }
