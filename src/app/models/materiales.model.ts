import { CatProveedorModel } from './proveedores.model';
import { UbicacionModel } from './ubicacion.model';
export class MaterialesModel{
  idMaterial: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipoMedicion: string;
  status: string;
  stock: string;
  visible: boolean;
  proveedores: CatProveedorModel[];
  ubicaciones: UbicacionModel[];
  constructor(){
    this.idMaterial = 0;
    this.nombre = '';
    this.descripcion = '';
    this.precio = 0.0;
    this.tipoMedicion = '';
    this.status = '';
    this.stock = '';
    this.visible = true;
    this.proveedores = [];
    this.ubicaciones = [];
  }
}
