export class CatClienteModel{
    idCliente: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono1: string;
    telefono2: string;
    direccion: string;
    visible : boolean;
    constructor(){
      this.idCliente = 0;
      this.nombre = '';
      this.apellidoPaterno = '';
      this.apellidoMaterno = '';
      this.telefono1 = '';
      this.telefono2 = '';
      this.direccion = '';
      this.visible = true
    }
  }
  