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
  listUbicaciones: UbicacionModel[] = [];
  lstMovimientos: CambiosDevolucionesModel[]=[];
  selectedArticulos: productoModel[];
  accion = '';
  selectedArticulo: productoModel = new productoModel();
  cols: any[] = [];
  CurrentDate = new Date();
  idUbicacionpara:string;
  idUbicacionde:string;

  constructor( private primengConfig: PrimeNGConfig,   public variablesGL: VariablesService,    private cambiosDevolucionesService: VentasService,
    private inventarioService: InventarioService,    private ubicacionesService:UbicacionesService,private movimientosService:MovimientosService) {
      this.cols = [
        // { field: 'idArticulo', header: 'ID' },
        { field: '', header: 'Imagen' },
        { field: 'sku', header: 'SKU' },
        { field: 'descripcion', header: 'Descripcion' },
        { field: 'existencia', header: 'Existencia' },
        // { field: 'fechaIngreso', header: 'Fecha Ingreso' },
        // { field:'categoria',header:'Categoria'},
        // { field: 'unidad', header: 'Unidad' },
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
       this.getCambiosyDevoluciones();
       this.ubicacionesService.getUbicaciones().subscribe(response => {
        if(response.exito){
          for(let ubicacion of response.respuesta){
            this.listUbicaciones.push(ubicacion)
          }
          if(this.variablesGL.getSucursal()){
            let ubiPreselected = this.listUbicaciones.find(x => x.direccion == this.variablesGL.getSucursal());

            //this.idUbicacionpara= ubiPreselected.idUbicacion.toString();
            console.log("data")
          }
        }
      }, err => {
    
      });
  }
  onChangeInventario(event) {
    console.log('event :' + event);
    console.log(event.value);
    this.idUbicacionpara=event.value

    this.getArticulos(this.idUbicacionpara);
    console.log("data")
}
  getArticulos(filtro:string) {
    console.log("Articulos")
    this.loading = true;
    this.inventarioService.SearchProductFilterUbicacion(filtro).subscribe(response => {
      console.log(response)
      if (response.exito) {
        console.log(response.exito)
        this.listArticulos = response.respuesta;
        console.log(this.listArticulos)
        this.loading = false;
        for (let art of this.listArticulos) {
          this.imagenes.push({ id: art.idArticulo, imagen64c: art.imagen })
        }
      }
    }, err => {
      this.loading = false;
    });
  }

  viewCodebar(producto : productoModel){
    this.accion = 'Codigo de Barras'
    this.selectedArticulo = { ...producto };
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }
 
  getCambiosyDevoluciones(){
    this.loading = true;
    this.movimientosService.getallMovimientos().subscribe(response => {
      if(response.exito){

        console.log(response)
         this.lstMovimientos = response.respuesta
        // this.lstCambiosDevoluciones.forEach(cambio => {
        //   cambio.fecha = this.variablesGL.getFormatoFecha(cambio.fecha).toString();
        // });
        this.loading = false;
        // console.log('cambios devoluciones --> ', this.lstCambiosDevoluciones);

      }else{
        this.lstMovimientos = [];
        this.loading = false;
      }
    }, err => {
      this.loading = false;;
    });
  }

  showDetail(){
    console.log("click")
  }
  
}
