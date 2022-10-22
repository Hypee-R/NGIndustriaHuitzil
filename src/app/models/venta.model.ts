import { CajaModel } from './caja.model';
import { productoModel } from './productos.model';

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
}
