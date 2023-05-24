import { Component, OnInit ,Input, Output,EventEmitter,SimpleChange} from '@angular/core';
import { Subscription } from 'rxjs';
import { CambiosDevolucionesModel } from 'src/app/models/cambios-devoluciones.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';

import { InventarioService } from 'src/app/services/inventario.service';
import { productoModel } from 'src/app/models/productos.model';
import { imagen64 } from '../../inventario/inventario.component';
import { MovimientosInventarioModel } from 'src/app/models/movimientos-inventario.model';
import {formatDate} from '@angular/common';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { MovimientoArticuloModel } from 'src/app/models/movimientos-inventario.model';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {
  @Input() _accion: string;
  @Input() _movimiento : MovimientosInventarioModel;
  @Output() saveEnvio: EventEmitter<boolean> = new EventEmitter<boolean>();
  statusPantalla: number
  rows = 0;
  selectedArticulos: productoModel[] = [];
  visibleDialog: boolean;
  dialogSubscription: Subscription = new Subscription();
  submitted = false;
  CurrentDate = new Date();
  listUbicaciones: UbicacionModel[] = [];
  movimiento: MovimientosInventarioModel = new MovimientosInventarioModel();
  loading: boolean = false;
  idUbicacionpara:string;
  ubicacionDeSeleccionada:UbicacionModel;
  ubicacionDestinoSeleccionada:UbicacionModel;
  idUbicacionde:string;
  listArticulos: productoModel[] ;
  imagenes: imagen64[] = []
  cols: any[] = [];
  accion = '';
  etiqueta = "Nuevo Envio"
  selectedArticulo: productoModel = new productoModel();
  constructor(private variablesGL: VariablesService,
    private ubicacionesService:UbicacionesService,
    private inventarioService: InventarioService,
    private movientosService : MovimientosService,
    private toastr: ToastrService,
    ) {
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
    this.accion = this._accion
    console.log(this.accion)
    if(this.accion == "Registrar"){
      this.movimiento = new MovimientosInventarioModel();
    }
    if(this.movimiento){
    this.movimiento = this._movimiento}
    //this.getUbicaciones()
  }
  ngOnInit(): void {
   this.getUbicaciones()
  }

  getUbicaciones(){
    this.listUbicaciones.shift()
    console.log(this.movimiento)
    this.ubicacionesService.getUbicaciones().subscribe(response => {
      if(response.exito){
        for(let ubicacion of response.respuesta){
          this.listUbicaciones.push(ubicacion)
        }
        if(this.variablesGL.getSucursal()){
          let ubiPreselected = this.listUbicaciones.find(x => x.direccion == this.variablesGL.getSucursal());
          console.log("data")
        }
      }
    }, err => {
  
    });
  }


  onChangeInventario(event) {
    //console.log('event :' + event);
    //console.log(event.value);
    this.ubicacionDeSeleccionada = event.value
    ///this.idUbicacionpara=this.ubicacionDeSeleccionada.direccion
    this.getArticulos(this.ubicacionDeSeleccionada.direccion);
    //console.log(this.ubicacionDeSeleccionada)
}

onChangeDestino(event){
  console.log(event.value)
  this.ubicacionDestinoSeleccionada = event.value
}

viewCodebar(producto : productoModel){
  this.accion = 'Codigo de Barras'
  this.selectedArticulo = { ...producto };
  setTimeout(() => {
    this.variablesGL.showDialog.next(true);
  }, 100);
}

getArticulos(filtro:string) {
  //console.log("Articulos")
  this.loading = true;
  this.inventarioService.SearchProductFilterUbicacion(filtro).subscribe(response => {
    console.log(response)
    if (response.exito) {
      //console.log(response.exito)
      this.listArticulos = response.respuesta;
      //console.log(this.listArticulos)
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

  validaEnvio(){
    console.log(this.movimiento)
  }

  registraEnvio(){
    let date = formatDate(new Date(), 'yyyy/MM/dd', 'en').toString()
    let newMovimiento = new MovimientosInventarioModel();
    newMovimiento.fecha = date
    newMovimiento.ubicacion = this.ubicacionDeSeleccionada.idUbicacion
    newMovimiento.status = "Envio"
    newMovimiento.receptor = 1
    newMovimiento.usuario = 4
    newMovimiento.direccion = this.ubicacionDeSeleccionada.direccion
    newMovimiento.ubicacionDestino = this.ubicacionDestinoSeleccionada.idUbicacion
    newMovimiento.usuarioEnvia = this.ubicacionDeSeleccionada.nombreEncargado
    newMovimiento.usuarioRecibe = this.ubicacionDestinoSeleccionada.nombreEncargado
    newMovimiento.movimientoArticulos = []
    console.log(newMovimiento)
    this.movientosService.addMovimiento(newMovimiento).subscribe(response => {
      console.log(response)
      if (response.exito) {
        this.hideDialog()
        this.toastr.success("Envio Registrado Correctamente",'Correcto');
        setTimeout(() => {
          this.saveEnvio.emit(true);
        }, 100);
      }
    }, err => {
      this.toastr.error("Error",'Error en los servicios');
      ///this.loading = false;
    });
    
  }
}
