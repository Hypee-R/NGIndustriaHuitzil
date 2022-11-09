export class CajaModel{
  idCaja: number;
  idEmpleado: number;
  fecha: string;
  monto: number;
  fechaCierre: string;
  montoCierre: number;
  constructor(){
    this.idCaja = 0;
    this.idEmpleado = 0;
    this.fecha = '';
    this.monto = 500;
    this.fechaCierre = null;
    this.montoCierre = 1000;
  }
}
