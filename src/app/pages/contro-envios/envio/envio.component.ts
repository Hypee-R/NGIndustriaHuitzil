import { Component, OnInit ,Input, SimpleChange} from '@angular/core';
import { Subscription } from 'rxjs';
import { CambiosDevolucionesModel } from 'src/app/models/cambios-devoluciones.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';

import { InventarioService } from 'src/app/services/inventario.service';
import { productoModel } from 'src/app/models/productos.model';
import { imagen64 } from '../../inventario/inventario.component';
@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {
  @Input() _accion: string;
  @Input() _movimiento : CambiosDevolucionesModel;
  statusPantalla: number
  rows = 0;
  selectedArticulos: productoModel[];
  visibleDialog: boolean;
  dialogSubscription: Subscription = new Subscription();
  submitted = false;
  CurrentDate = new Date();
  listUbicaciones: UbicacionModel[] = [];
  movimiento: CambiosDevolucionesModel = new CambiosDevolucionesModel();
  loading: boolean = false;
  idUbicacionpara:string;
  idUbicacionde:string;
  listArticulos: productoModel[] ;
  imagenes: imagen64[] = []
  cols: any[] = [];
  accion = '';
  selectedArticulo: productoModel = new productoModel();
  constructor(private variablesGL: VariablesService,private ubicacionesService:UbicacionesService, private inventarioService: InventarioService) {
    this.cols = [
  
      { field: '', header: 'Imagen' },
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'existencia', header: 'Existencia' },
      { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
      { field: 'precio', header: 'precio' },
      { field: '', header: 'Etiqueta'},
      { field: '', header: 'Cantidad'}
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
   

    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
  });


    this.movimiento = this._movimiento
   
   }
   ngOnChanges(changes: SimpleChange): void {
    this.movimiento = this._movimiento
 
   
  }
  ngOnInit(): void {
    console.log(this.movimiento)
    this.ubicacionesService.getUbicaciones().subscribe(response => {
      if(response.exito){
        for(let ubicacion of response.respuesta){
          this.listUbicaciones.push(ubicacion)
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

viewCodebar(producto : productoModel){
  this.accion = 'Codigo de Barras'
  this.selectedArticulo = { ...producto };
  setTimeout(() => {
    this.variablesGL.showDialog.next(true);
  }, 100);
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

  hideDialog() {
    this.submitted = false;
    this.variablesGL.showDialog.next(false);
  }
}
