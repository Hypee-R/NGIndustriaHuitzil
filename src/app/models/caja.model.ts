import { UsuarioModel } from "./usuarios.model";
import { VentaModel } from "./venta.model";

export class CajaModel{
  idCaja: number;
  idEmpleado: number;
  fecha: string;
  monto: number;
  fechaCierre: string;
  montoCierre: number;
  idEmpleadoNavigation : UsuarioModel
  venta: VentaModel[];
  constructor(){
    this.idCaja = 0;
    this.idEmpleado = 0;
    this.fecha = '';
    this.monto = 1000;
    this.fechaCierre = null;
    this.montoCierre = 1000;
  }
}
