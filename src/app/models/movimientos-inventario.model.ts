import { productoModel } from "./productos.model";
import { VentaArticuloModel, VentaModel } from "./venta.model";

export class MovimientosInventarioModel {
    idMovimiento?: number;
    fecha?: string;
    ubicacion?: number;
    ubicacionDestino?:number;
    usuario?: number;
    status?: string;
    receptor?: number;
    direccion?: string;
    usuarioRecibe?: string;
    usuarioEnvia?: string;
    ubicacionDestinodesc:string;
    movimientoArticulos?: MovimientoArticuloModel[];
}

export class MovimientoArticuloModel {
    idCambioArticulo: number;
    idMovimiento: number;
    idArticulo: number;
    sku?: string;
    idUbicacion: number;
    idCategoria: string;
    idTalla: number;
    existencia: number;
    descripcion: string;
    fechaIngreso?: string;
    // Todo : Cambio por string preguntar
    ubicacion?: string;
}
