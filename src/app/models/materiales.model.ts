export class MaterialesModel{
  idMaterial: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipoMedicion: string;
  status: string;
  stock: string;
  visible: boolean;
  constructor(){
    this.idMaterial = 0;
    this.nombre = '';
    this.descripcion = '';
    this.precio = 0.0;
    this.tipoMedicion = '';
    this.status = '';
    this.stock = '';
    this.visible = true;
  }
}
