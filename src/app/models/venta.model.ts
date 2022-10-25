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
      this.idVenta = 1;
      this.idCaja = 18;
      this.fecha = "2022-10-21 07:51:36.000";
      this.noTicket = "090621102022";
      this.tipoPago = "EFECTIVO";
      this.tipoVenta = "CONTADO";
      this.noArticulos = 6;
      this.subtotal = 1350.00;
      this.total = 1350.00;
      this.ventaArticulo = [
        { idVentaArticulo: 1, idVenta: 1, idArticulo: 1, cantidad: 3, precioUnitario: 250.00, subtotal: 750.00,
          articulo:
          {
            idArticulo : 1,
            unidad: "5",
            existencia: "10",
            descripcion: "Playeras tipo polo blancas",
            fechaIngreso: "2022-08-17",
            idUbicacion: 1,
            idCategoria: 1,
            idTalla: 3,
            talla: "M",
            ubicacion: "Coyoacan",
            categoria: "Playera tipo polo",
            imagen: "",
            precio: 250.00,
            sku: "01PTPM"
          },
          venta: null
        },
        { idVentaArticulo: 2, idVenta: 1, idArticulo: 2, cantidad: 3, precioUnitario: 200.00, subtotal: 600.00,
          articulo:
          {
            idArticulo : 2,
            unidad: "5",
            existencia: "50",
            descripcion: "Playeras tipo polo",
            fechaIngreso: "2022-10-19",
            idUbicacion: 2,
            idCategoria: 1,
            idTalla: 1,
            talla: "XS",
            ubicacion: "Almacen 2",
            categoria: "Playera tipo polo",
            imagen: "",
            precio: 200.00,
            sku: "01PTXS"
          },
          venta: null
        }
      ]
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
