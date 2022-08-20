import { ProveedorMaterialModel } from './proveedores-materiales.model';
import { UsuarioModel } from './usuarios.model';
export class SolicitudesMaterialModel{
  idSolicitud: number;
  fecha: Date;
  cantidad: number;
  comentarios: string;
  idProveedorMaterial: number;
  proveedorMaterial: ProveedorMaterialModel;
  status: string;
  fechaUpdate: Date;
  costoTotal: number;
  idUser: number;
  usuario: UsuarioModel;
  constructor(){
    this.idSolicitud = 0;
    this.fecha = new Date();
    this.cantidad = 0;
    this.comentarios = '';
    this.idProveedorMaterial = 0;
    this.proveedorMaterial = null;
    this.status = '';
    this.fechaUpdate = new Date();
    this.costoTotal = 0;
    this.idUser = 0;
    this.usuario = null;
  }
}
