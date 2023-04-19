import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';
import { productoModel } from 'src/app/models/productos.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { CambiosDevolucionesModel } from '../../models/cambios-devoluciones.model';
import { VentasService } from '../../services/ventas.service';
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
  listArticulos: productoModel[] ;
  loading: boolean = false;
  imagenes: imagen64[] = []
  list2: productoModel[];
  rows = 0;

  lstCambiosDevoluciones: CambiosDevolucionesModel[]=[];
  
  constructor( private primengConfig: PrimeNGConfig,   public variablesGL: VariablesService,    private cambiosDevolucionesService: VentasService,
    private inventarioService: InventarioService) {
      this.statusPantalla = this.variablesGL.getStatusPantalla();
      let status = this.variablesGL.getPantalla();
      if(status == 'celular'){
        this.rows = 6;
      }else if(status == 'tablet'){
        this.rows = 7;
      }else if(status == 'laptop'){
        this.rows = 7;
      }else{
        this.rows = 7;
      }
     }

  ngOnInit(): void {
    this.getArticulos();
    // this.list1 = //initialize list 1
       this.list2 = [];//initialize list 2
       this.getCambiosyDevoluciones();
  }

  getArticulos() {
    this.loading = true;
    this.inventarioService.getArticulos().subscribe(response => {
      if (response.exito) {
        this.listArticulos = response.respuesta;
        this.loading = false;
        for (let art of this.listArticulos) {
          this.imagenes.push({ id: art.idArticulo, imagen64c: art.imagen })
        }
      }
    }, err => {
      this.loading = false;
    });
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

}
