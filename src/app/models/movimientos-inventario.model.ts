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
    tipoPaquete?:string;
    ubicacionDestinodesc:string;
    movimientoArticulos?: MovimientoArticuloModel[];
}

export class MovimientoArticuloModel {
    idCambioArticulo: number;
    idMovimiento: number;
    idArticulo: number;
  
  status: string;
  existencia: string;
  descripcion: string;
  fechaIngreso: string;
  idUbicacion: number;
  idCategoria: number;
  idTalla:number ;
  talla:string;
  ubicacion:string;
  categoria:string;
  imagen:string;
  precio:number;
  sku: string;
  cantMovimiento? : number
}
