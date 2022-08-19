import { MaterialesModel } from "./materiales.model";
import { CatProveedorModel } from "./proveedores.model";

export class ProveedorMaterialModel{
  idProveedorMaterial: number;
  idProveedor: number;
  idMaterial: number;
  proveedor: CatProveedorModel;
  material: MaterialesModel;
  constructor(){
    this.idProveedorMaterial = 0;
    this.idProveedor = 0;
    this.idMaterial = 0;
    this.proveedor = new CatProveedorModel();
    this.material = new MaterialesModel();
  }
}
