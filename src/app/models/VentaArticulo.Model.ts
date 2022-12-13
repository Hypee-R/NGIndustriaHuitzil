import { CambiosDevolucionesArticuloModel } from "./cambios-devoluciones.model";
import { productoModel } from "./productos.model";
import { VentaModel } from "./venta.model";

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