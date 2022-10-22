import { Component, OnInit } from '@angular/core';
import { CambiosDevolucionesModel } from '../../models/cambios-devoluciones.model';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-cambios-y-devoluciones',
  templateUrl: './cambios-y-devoluciones.component.html',
  styleUrls: ['./cambios-y-devoluciones.component.css']
})
export class CambiosYDevolucionesComponent implements OnInit {

  statusPantalla: number;
  loading: boolean = false;
  lstCambiosDevoluciones: CambiosDevolucionesModel[]=[];
  selectedCambio: CambiosDevolucionesModel;

  accion = '';
  rows = 0;
  cols: any[] = [];
  constructor(
    private variablesGL: VariablesService,
  ) {
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 4;
    }else{
      this.rows = 11;
    }
  }

  ngOnInit(): void {
  }

  getCambiosyDevoluciones(){

  }

  openModalAdd(){
      this.accion = 'Agregar';

  }

  showDetails(cambioDevolucion: CambiosDevolucionesModel){
      this.accion = 'Detalles';

  }

}
