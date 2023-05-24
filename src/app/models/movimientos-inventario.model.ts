import { productoModel } from "./productos.model";
import { VentaArticuloModel, VentaModel } from "./venta.model";

export class MovimientosInventarioModel {
    idMovimiento: number;
    fecha: string;
    ubicacion: number;
    usuario: number;
    status: string;
    receptor?: number;
    direccion?: string;
    usuarioRecibe?: string;
    usuarioEnvia?: string;
    ubicacionDestino?: number;
    ubicacionDestinodesc:string;
    movimientoArticulos?: MovimientoArticuloModel[];
}

export class MovimientoArticuloModel {
    idCambioArticulo: number;
    idMovimiento: number;
    idArticulo: number;
    sku?: number;
    idUbicacion: number;
    idCategoria: string;
    idTalla: string;
    existencia: number;
    descripcion: number;
    fechaIngreso?: number;
    ubicacion?: productoModel;
}
