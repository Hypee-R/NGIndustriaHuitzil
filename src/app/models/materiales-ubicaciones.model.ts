import { MaterialesModel } from "./materiales.model";
import { UbicacionModel } from './ubicacion.model';

export class MaterialUbicacionModel{
  idMaterialUbicacion: number;
  idMaterial: number;
  idUbicacion: number;
  material: MaterialesModel;
  ubicacion: UbicacionModel;
  constructor(){
    this.idMaterialUbicacion = 0;
    this.idMaterial = 0;
    this.idUbicacion = 0;
    this.material = new MaterialesModel();
    this.ubicacion = new UbicacionModel();
  }
}
