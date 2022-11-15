import { Component, OnInit } from '@angular/core';
import { CambiosDevolucionesModel } from '../../models/cambios-devoluciones.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from '../../services/ventas.service';

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
    private cambiosDevolucionesService: VentasService
  ) {
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 5;
    }else{
      this.rows = 11;
    }
  }

  ngOnInit(): void {
    this.getCambiosyDevoluciones();
  }

  getCambiosyDevoluciones(){
    this.loading = true;
    this.cambiosDevolucionesService.getCambiosDevoluciones().subscribe(response => {
      if(response.exito){
        this.lstCambiosDevoluciones = response.respuesta
        this.lstCambiosDevoluciones.forEach(cambio => {
          cambio.fecha = this.variablesGL.getFormatoFecha(cambio.fecha).toString();
        });
        this.loading = false;
        // console.log('cambios devoluciones --> ', this.lstCambiosDevoluciones);

      }else{
        this.lstCambiosDevoluciones = [];
        this.loading = false;
      }
    }, err => {
      this.loading = false;;
    });
  }

  openModalAdd(){
      this.accion = 'Agregar';
      this.selectedCambio = new CambiosDevolucionesModel();
      setTimeout(() => {
        this.variablesGL.showDialog.next(true);
      }, 100);
  }

  showDetails(cambioDevolucion: CambiosDevolucionesModel){
      this.accion = 'Detalles';
      this.selectedCambio = cambioDevolucion;
      setTimeout(() => {
        this.variablesGL.showDialog.next(true);
      }, 100);
  }

}
