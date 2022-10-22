import { productoModel } from "./productos.model";
import { VentaArticuloModel, VentaModel } from "./venta.model";

export class CambiosDevolucionesModel {
    idCambioDevolucion: number;
    idVenta: number;
    fecha: string;
    noArticulos: number;
    subtotal: number;
    total?: number;
    venta?: VentaModel;
    cambiosDevolucionesArticulos?: CambiosDevolucionesArticuloModel[];
}

export class CambiosDevolucionesArticuloModel {
    idCambioArticulo: number;
    idCambioDevolucion: number;
    idVentaArticulo: number;
    idArticulo?: number;
    cantidad: number;
    estado: string;
    motivoCambio: string;
    precioAnterior: number;
    precioActual: number;
    deducible?: number;
    articulo?: productoModel;
    ventaArticulo?: VentaArticuloModel;
}
