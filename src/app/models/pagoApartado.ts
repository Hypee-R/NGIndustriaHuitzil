export class PagoApartado{
    IdPagoApartado : number
    idApartado : number
    idCaja: number
    fecha: string;
    fechaEntrega: string;
    cantidad : number;
    tipoPago:string;
    tipoPagoValida:string;
    montoTarjeta : number;
    montoEfectivo : number;
    noTicketPago:string
    constructor(){
        this.idApartado = 0
        this.fecha = ''
        this.cantidad  = 0
    }
  }
