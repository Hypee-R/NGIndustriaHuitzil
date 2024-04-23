import { CambiosDevolucionesArticuloModel } from "./cambios-devoluciones.model";
import { productoModel } from "./productos.model";
import { VentaModel } from "./venta.model";

export class ApartadoArticuloModel {
    idVentaArticulo: number;
    idVenta: number;
    idArticulo: number;
    cantidad: number;
    precioUnitario: number;
    subtotal?: number;
    articulo?: productoModel;
    venta?: VentaModel;
    expanded?: boolean;
    sku: string;
    descripcion: string;
    precio:number;
    cambiosArticulo?: CambiosDevolucionesArticuloModel[];
}