import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';
import { productoModel } from 'src/app/models/productos.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { CambiosDevolucionesModel } from '../../models/cambios-devoluciones.model';
import { VentasService } from '../../services/ventas.service';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';

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
  listArticulos: productoModel[] ;
  loading: boolean = false;
  imagenes: imagen64[] = []
  list2: productoModel[];
  rows = 0;
  lstMovimientos: MovimientosInventarioModel[]=[];
  selectedArticulos: productoModel[];
  accion = '';
  selectedArticulo: productoModel = new productoModel();
  cols: any[] = [];

  openModal = ''
  selectedMovimiento : MovimientosInventarioModel;

  constructor( private primengConfig: PrimeNGConfig,   public variablesGL: VariablesService,    private cambiosDevolucionesService: VentasService,
    private inventarioService: InventarioService,    private ubicacionesService:UbicacionesService,private movimientosService:MovimientosService) {
      this.cols = [
        { field: '', header: 'Imagen' },
        { field: 'sku', header: 'SKU' },
        { field: 'descripcion', header: 'Descripcion' },
        { field: 'existencia', header: 'Existencia' },
        { field: 'talla', header: 'Talla' },
        { field: 'ubicacion', header: 'Ubicacion' },
        { field: 'precio', header: 'precio' },
        { field: '', header: 'Etiqueta'},
        { field: '', header: 'Cantidad Envio'}
      ];
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
   // getArticulos(filtro:string)
    // this.list1 = //initialize list 1
       this.list2 = [];//initialize list 2
       this.getMovimientos();
   
  }
 


  viewCodebar(producto : productoModel){
    this.accion = 'Codigo de Barras'
    this.selectedArticulo = { ...producto };
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
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
    this.accion = 'Actualizar';
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
