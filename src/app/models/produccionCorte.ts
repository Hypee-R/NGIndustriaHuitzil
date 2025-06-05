export class CatProduccionCorteModel{
  idProduccion: number;
  folio:string;
  responsable:string;
  comentarios:string;
  fechaInicio:string;
  status: string;
  articulos: any;
  materiales: any;
    constructor(){
      this.idProduccion = 0;
      this.folio = '';
      this.responsable = '';
      this.comentarios = '';
      this.fechaInicio = '';
      this.status = '';
    }
  }
  