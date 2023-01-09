import { CajaModel } from './caja.model';
import { productoModel } from './productos.model';
import { CambiosDevolucionesArticuloModel } from './cambios-devoluciones.model';

export class VentaModel {
    idVenta: number;
    idCaja: number;
    fecha: string;
    noTicket: string;
    tipoPago: string;
    tipoVenta: string;
    noArticulos: number;
    subtotal: number;
    total?: number;
    caja?: CajaModel;
    ventaArticulo: VentaArticuloModel[];
    constructor(){
      this.idVenta = 0;
      this.idCaja = 0;
      this.fecha = "";
      this.noTicket = "";
      this.tipoPago = "";
      this.tipoVenta = "";
      this.noArticulos = 0;
      this.subtotal = 0;
      this.total = 0;
      
    }
}

export class VentaArticuloModel {
    idVentaArticulo: number;
    idVenta: number;
    idArticulo: number;
    cantidad: number;
    precioUnitario: number;
    subtotal?: number;
    articulo?: productoModel;
    venta?: VentaModel;
    expanded?: boolean;
    cambiosArticulo?: CambiosDevolucionesArticuloModel[];
}
