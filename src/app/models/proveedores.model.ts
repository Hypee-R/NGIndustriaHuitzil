export class CatProveedorModel{
  idProveedor: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono1: string;
  telefono2: string;
  correo: string;
  direccion: string;
  encargadoNombre: string;
  constructor(){
    this.idProveedor = 0;
    this.nombre = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.telefono1 = '';
    this.telefono2 = '';
    this.correo = '';
    this.direccion = '';
    this.encargadoNombre = '';
  }
}
