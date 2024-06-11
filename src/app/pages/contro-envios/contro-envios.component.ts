import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosInventarioModel } from 'src/app/models/movimientos-inventario.model';
export interface imagen64 {
  id: number,
  imagen64c: string
}
@Component({
  selector: 'app-contro-envios',
  templateUrl: './contro-envios.component.html',
  styleUrls: ['./contro-envios.component.css']
})
export class ControEnviosComponent implements OnInit {
  statusPantalla: number
  loading: boolean = false;
  rows = 0;
  lstMovimientos: MovimientosInventarioModel[]=[];
  accion = '';
  openModal = ''
  selectedMovimiento : MovimientosInventarioModel;

  constructor(   public variablesGL: VariablesService
    ,private movimientosService:MovimientosService) {
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
       this.getMovimientos();
  }

  getMovimientos(){
    this.loading = true;
    this.movimientosService.getallMovimientos().subscribe(response => {
      if(response.exito){
        this.lstMovimientos = response.respuesta
        this.loading = false;

      }else{
        this.lstMovimientos = [];
        this.loading = false;
      }
    }, err => {
      this.loading = false;;
    });
  }

  showDetail(movimiento :MovimientosInventarioModel){
    this.selectedMovimiento = movimiento
    console.log( this.selectedMovimiento.status)
    this.accion =  this.selectedMovimiento.status;
    this.openModal = 'Actualizar'
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);

  }

  showDetailAdd(){
    this.accion = 'Registrar';
    this.openModal = 'Registrar'
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 300);
  }
}
