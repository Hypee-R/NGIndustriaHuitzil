export class UbicacionModel{
    idUbicacion: number;
    direccion: string;
    nombreEncargado: string;
    apellidoPEncargado: string;
    apellidoMEncargado: string;
    telefono1: string;
    telefono2: string;
    correo: string;
    articulos: any;
    constructor(){
        this.idUbicacion = 0;
        this.direccion = '';
        this.nombreEncargado = '';
        this.apellidoMEncargado = '';
        this.telefono1 = '';
        this.telefono2 = '';
        this.correo = '';

      }
}
