export class productoVentaModel{
    idArticulo: number;
    unidad: string;
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
    cantidad : number
      constructor(){
      this.idArticulo = 0;
      this.unidad = '';
      this.descripcion = '';
      this.existencia = '';
      this.fechaIngreso= '2022-10-19';
      this.idCategoria = 0;
      this.idTalla =  0;
      this.categoria='';
      this.talla='';
      this.ubicacion='';
      this.imagen='';
      this.precio = 0;
      this.sku = '';
      this.cantidad = 1
    }
  }
  