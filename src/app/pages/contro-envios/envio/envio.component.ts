import { Component, OnInit ,Input, Output,EventEmitter,SimpleChange} from '@angular/core';
import { Subscription } from 'rxjs';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
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
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
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
    this.accion = this._accion
    this.movimiento = this._movimiento
   
   }

ngOnChanges(changes: SimpleChange): void {
    this.accion = this._accion
    console.log(this.accion)
    if(this.accion == "Registrar") this.movimiento = new MovimientosInventarioModel();
    if(this._movimiento) this.movimiento = this._movimiento

    if(this.accion == "Actualizar"){
      this.getArticulosMovimientos()
    }
    else{
      this.listArticulos = []
      this.getUbicaciones()
    }
  }
  ngOnInit(): void {
  
   if(this.accion == "Actualizar"){
      this.getArticulosMovimientos()
   }
   else{
    this.listArticulos = []
    this.getUbicaciones()
   }
  }

  getArticulosMovimientos(){
    this.listArticulos = []
    this.movimiento.movimientoArticulos.forEach(articulo =>{
      let ar = new productoModel
      ar.sku = articulo.sku
      ar.descripcion = articulo.descripcion
      ar.existencia = articulo.existencia.toString()
      ar.ubicacion = articulo.ubicacion
      this.listArticulos.push(ar)
    })
  }



  getUbicaciones(){
    this.listUbicaciones.shift()
    console.log(this.movimiento)
    this.ubicacionesService.getUbicaciones().subscribe(response => {
      if(response.exito){
        this.listUbicaciones = response.respuesta
        /*for(let ubicacion of response.respuesta){
          this.listUbicaciones.push(ubicacion)
        }*/
        if(this.variablesGL.getSucursal()){
          let ubiPreselected = this.listUbicaciones.find(x => x.direccion == this.variablesGL.getSucursal());
          console.log("data")
        }
      }
    }, err => {
  
    });
  }


onChangeInventario(event) {
    this.ubicacionDeSeleccionada = event.value
    this.getArticulos(this.ubicacionDeSeleccionada.direccion);
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
  this.loading = true;
  this.inventarioService.SearchProductFilterUbicacion(filtro).subscribe(response => {
    console.log(response)
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

  hideDialog() {
    this.submitted = false;
    this.variablesGL.showDialog.next(false);
  }

  validaEnvio(){
    console.log(this.movimiento)
  }

  registraEnvio(){
    if(this.ubicacionDeSeleccionada == undefined || this.ubicacionDestinoSeleccionada == undefined){
      this.toastr.error("Error","Selecciona una dirección de envio y una  dirección de destino")
      return
    }
    if(this.selectedArticulos.length == 0){
      this.toastr.error("Error","Debe selecionar al menos un articulo")
      return
    }
    this.confirmationService.confirm({
      message: 'Esta seguro de realizar el movimiento de inventario?',
      header: 'Confirmacion de Envio',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'has aceptado el envio ' });
          this.addMovimiento()
        },
      reject: (type) => {
          switch (type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({ severity: 'error', summary: 'cancelado', detail: 'Cancelo el envio de mercancia' });
                  break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({ severity: 'warn', summary: 'cancelado', detail: 'No confirmo el envio' });
                  break;
          }
      }
  });

    
  }

  addMovimiento(){
   let date = formatDate(new Date(), 'yyyy/MM/dd', 'en').toString()
    let newMovimiento = new MovimientosInventarioModel();
    let movimientosArticulos : MovimientoArticuloModel []= []
   
    console.log(this.selectedArticulos)

    newMovimiento.fecha = this.CurrentDate.toString()
    newMovimiento.ubicacion = this.ubicacionDeSeleccionada.idUbicacion
    newMovimiento.status = "Envio"
    newMovimiento.receptor = 1
    newMovimiento.usuario = 4
    newMovimiento.direccion = this.ubicacionDeSeleccionada.direccion
    newMovimiento.ubicacionDestino = this.ubicacionDestinoSeleccionada.idUbicacion
    newMovimiento.usuarioEnvia = this.ubicacionDeSeleccionada.nombreEncargado
    newMovimiento.usuarioRecibe = this.ubicacionDestinoSeleccionada.nombreEncargado
   
    
    /// cambiar por articulos seleccionados
    this.selectedArticulos.forEach(articulo =>
    {
      let newMovimientoArticulo =  new MovimientoArticuloModel()
      newMovimientoArticulo.idArticulo = articulo.idArticulo
      newMovimientoArticulo.sku = articulo.sku
      newMovimientoArticulo.idUbicacion =  this.ubicacionDeSeleccionada.idUbicacion
      newMovimientoArticulo.existencia = Number(articulo.existencia)
      newMovimientoArticulo.idTalla = articulo.idTalla
      newMovimientoArticulo.descripcion = articulo.descripcion
      newMovimientoArticulo.fechaIngreso  = articulo.fechaIngreso
      newMovimientoArticulo.ubicacion = articulo.ubicacion
      movimientosArticulos.push(newMovimientoArticulo)
    }
    )
    newMovimiento.movimientoArticulos = movimientosArticulos
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
    });
  }
}
