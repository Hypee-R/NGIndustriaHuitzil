import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { ConfirmationService, MessageService, ConfirmEventType, Message } from 'primeng/api';
import { InventarioService } from 'src/app/services/inventario.service';
import { productoModel } from 'src/app/models/productos.model';
import { imagen64 } from '../../inventario/inventario.component';
import { MovimientosInventarioModel } from 'src/app/models/movimientos-inventario.model';
import { formatDate } from '@angular/common';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { ToastrService } from 'ngx-toastr';
import { MovimientoArticuloModel } from 'src/app/models/movimientos-inventario.model';
import { UsuarioAuthModel } from 'src/app/models/usuario-auth.model';


@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {
  @Input() _accion: string;
  @Input() _movimiento: MovimientosInventarioModel;
  @Output() saveEnvio: EventEmitter<boolean> = new EventEmitter<boolean>();
  statusPantalla: number;
  rows = 0;
  selectedArticulos: productoModel[] = [];
  visibleDialog: boolean;
  dialogSubscription: Subscription = new Subscription();
  submitted = false;
  CurrentDate = new Date();
  listUbicaciones: UbicacionModel[] = [];
  movimiento: MovimientosInventarioModel = new MovimientosInventarioModel();
  loading: boolean = false;
  tipoPaquete: string;
  conteo;
  idUbicacionpara: string;
  ubicacionDeSeleccionada: UbicacionModel;
  ubicacionDestinoSeleccionada: UbicacionModel;
  idUbicacionde: string;
  listArticulos: productoModel[];
  imagenes: imagen64[] = [];
  cols: any[] = [];
  accion = '';
  etiqueta = "";
  messages: Message[] | undefined;
  userAuth: UsuarioAuthModel;
  selectedArticulo: productoModel = new productoModel();
  constructor(private variablesGL: VariablesService,
    private ubicacionesService: UbicacionesService,
    private inventarioService: InventarioService,
    private movientosService: MovimientosService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.userAuth = JSON.parse(localStorage.getItem('usuario'));
    console.log(this.userAuth);
    this.cols = [
      { field: '', header: 'Imagen' },
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'existencia', header: 'Existencia' },
      { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
      { field: 'precio', header: 'precio' },
      { field: '', header: 'Cantidad' }
    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if (status == 'celular') {
      this.rows = 6;
    } else if (status == 'tablet') {
      this.rows = 7;
    } else if (status == 'laptop') {
      this.rows = 7;
    } else {
      this.rows = 7;
    }
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
    });
    this.accion = this._accion;
    this.movimiento = this._movimiento;
  }

  ngOnChanges(): void {
    this.accion = this._accion;
    console.log("accion",this.accion);

    if (this._movimiento) this.movimiento = this._movimiento;

    if (this.accion == "Registrar"||this.accion =='') {
      this.movimiento = new MovimientosInventarioModel();
      this.listArticulos = [];
      this.getUbicaciones();
    }
    if (this.accion == "ENVIO") {
      this.getArticulosMovimientos();
      this.messages = [{ severity: 'success', summary: 'Realizar Conteo', detail: "Se confirmara el conteo de Piezas del Envio" }];
    }
    if (this.accion == "CONTEO") {
      this.getArticulosMovimientos();
      this.messages = [{ severity: 'warn', summary: 'Realizar Recibo', detail: "Se confirmara el Recibo de Piezas del Envio" }];

    }
    if (this.accion == "RECIBO") {
      this.getArticulosMovimientos();
      this.messages = [{ severity: 'info', summary: 'En sucursal', detail: " Las piezas se encuentran en sucursal disponibles, Total " + this.movimiento.totalPiezas }];

    }



  }
  ngOnInit(): void {
  }

  getArticulosMovimientos() {
    //Traemos los Articulos Movimientos
    this.listArticulos = [];
    this.movimiento.movimientoArticulos.forEach(articulo => {
      this.listArticulos.push(articulo);
    });
    console.log(this.listArticulos);

  }



  getUbicaciones() {
    console.log("Get Ubicacions");
    this.listUbicaciones.shift();
    this.ubicacionesService.getUbicaciones().subscribe(response => {
      if (response.exito) {
        this.listUbicaciones = response.respuesta;

        // if(this.variablesGL.getSucursal()){
        //   let ubiPreselected = this.listUbicaciones.find(x => x.direccion == this.variablesGL.getSucursal());
        // }
      }
    }, err => {
    });
  }


  onChangeInventario(event) {
    this.ubicacionDeSeleccionada = event.value;
    this.getArticulos(this.ubicacionDeSeleccionada.direccion);
  }


  onChangeDestino(event) {
    console.log(event.value);
    this.ubicacionDestinoSeleccionada = event.value;
    this.idUbicacionde = this.ubicacionDestinoSeleccionada.nombreEncargado + " " + this.ubicacionDestinoSeleccionada.apellidoPEncargado + " " + this.ubicacionDestinoSeleccionada.apellidoMEncargado;
  }


  getArticulos(filtro: string) {
    this.loading = true;
    this.inventarioService.SearchProductFilterUbicacion(filtro).subscribe(response => {
      console.log(response);
      if (response.exito) {
        this.listArticulos = response.respuesta;
        this.loading = false;
        for (let art of this.listArticulos) {
          this.imagenes.push({ id: art.idArticulo, imagen64c: art.imagen });
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

  validaConteo() {
    this.movimiento.status = 'CONTEO';
    this.confirmationService.confirm({
      message: 'Confirma que se realizo el conteo De la mercancia correctamente: Total Piezas ' + this.movimiento.totalPiezas,
      header: 'Confirmar conteo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.movientosService.validaConteo(this.movimiento).subscribe(response => {
          console.log(response);
          if (response.exito) {
            this.hideDialog();
           //limpiamos todos los objetos del envio
           this.ubicacionDeSeleccionada = new UbicacionModel();
           this.selectedArticulos = [];
           this.movimiento= new MovimientosInventarioModel();
           this.tipoPaquete=''
           this.conteo=null
           
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'has validado el recibo' });

            setTimeout(() => {
              this.saveEnvio.emit(true);
            }, 100);
          }
        }, err => {
          this.toastr.error("Error", 'Error en los servicios');
        });


      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'cancelado', detail: 'Cancelo el Conteo de mercancia' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'cancelado', detail: 'No confirmo el conteo' });
            break;
        }
      }
    });
  }

  RecibeEnvio() {
    console.log(this.movimiento);
    this.movimiento.status = 'RECIBO';
    this.confirmationService.confirm({
      message: 'Al recibir la mercancia se Confirma que se recibio en la sucursal destino ',
      header: 'Recibir Mercancia?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.movimiento);
        this.movientosService.cerrarMovimiento(this.movimiento).subscribe(response => {
          console.log(response);
          if (response.exito) {
            this.hideDialog();
       //limpiamos todos los objetos del envio
       this.ubicacionDeSeleccionada = new UbicacionModel();
       this.selectedArticulos = [];
       this.movimiento= new MovimientosInventarioModel();
       this.tipoPaquete=''
       this.conteo=null
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'has validado el recibo' });

            setTimeout(() => {
              this.saveEnvio.emit(true);
            }, 100);
          }
        }, err => {
          this.toastr.error("Error", 'Error en los servicios');
        });


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

  registraEnvio() {
    let valido = true;
    //  let total=0
    if (this.ubicacionDeSeleccionada == undefined || this.ubicacionDestinoSeleccionada == undefined) {
      this.toastr.error("Error", "Selecciona una dirección de envio y una  dirección de destino");
      return;
    }

    //TODO:se debe de descomentar para pruebas daniel 
    if (this.ubicacionDeSeleccionada.idUbicacion == this.ubicacionDestinoSeleccionada.idUbicacion) {
      this.toastr.error("Error", "la  dirección de envio y la dirección de destino no pueden ser la misma");
      return;
    }

    if (this.selectedArticulos.length == 0) {
      this.toastr.error("Error", "Debe selecionar al menos un articulo");
      return;
    }

    this.selectedArticulos.forEach(articulo => {
      //Conteo de Piezas
      if (articulo.CantMovimiento == null || articulo.CantMovimiento == undefined) {
        this.toastr.error("Error", "Debe agregar una cantidad a " + articulo.descripcion);
        valido = false;
        return;
      }
      if (articulo.CantMovimiento == 0) {
        this.toastr.error("Error", "Debe agregar una cantidad mayor a 0 " + articulo.descripcion);
        valido = false;
        return;
      }

    });

    if (!valido) {
      return;
    }

    //Calculamos el TOTAL
    this.conteo = this.selectedArticulos.reduce(
      (acc, el) => acc + el.CantMovimiento,
      0

    );

    this.confirmationService.confirm({
      message: 'Esta seguro de realizar el movimiento de inventario? Total de piezas:' + this.conteo,
      header: 'Confirmacion de Envio',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'has aceptado el envio ' });
        this.addMovimiento();
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


  //Registro de Movimientos
  addMovimiento() {
    let date = formatDate(new Date(), 'dd/MM/yyyy, hh:mm a', 'en').toString();
    let newMovimiento = new MovimientosInventarioModel();
    let movimientosArticulos: MovimientoArticuloModel[] = [];
    newMovimiento.fecha = date;
    newMovimiento.ubicacion = this.ubicacionDeSeleccionada.idUbicacion;
    newMovimiento.status = "ENVIO";
    newMovimiento.usuario = this.userAuth.id;
    newMovimiento.direccion = this.ubicacionDeSeleccionada.direccion;
    newMovimiento.ubicacionDestino = this.ubicacionDestinoSeleccionada.idUbicacion;
    newMovimiento.usuarioEnvia = this.ubicacionDeSeleccionada.nombreEncargado;
    newMovimiento.usuarioRecibe = this.ubicacionDestinoSeleccionada.nombreEncargado;
    newMovimiento.tipoPaquete = this.tipoPaquete;
    newMovimiento.totalPiezas = this.conteo;
    /// cambiar por articulos seleccionados
    this.selectedArticulos.forEach(articulo => {
      let newMovimientoArticulo = new MovimientoArticuloModel();
      newMovimientoArticulo.idArticulo = articulo.idArticulo;
      newMovimientoArticulo.status = articulo.status;
      newMovimientoArticulo.existencia = articulo.existencia;
      newMovimientoArticulo.descripcion = articulo.descripcion;
      newMovimientoArticulo.fechaIngreso = articulo.fechaIngreso;
      newMovimientoArticulo.idUbicacion = articulo.idUbicacion;
      newMovimientoArticulo.idCategoria = articulo.idCategoria;
      newMovimientoArticulo.idTalla = articulo.idTalla;
      newMovimientoArticulo.talla = articulo.talla;
      newMovimientoArticulo.ubicacion = articulo.ubicacion;
      newMovimientoArticulo.categoria = articulo.categoria;
      newMovimientoArticulo.imagen = articulo.imagen;
      newMovimientoArticulo.precio = articulo.precio;
      newMovimientoArticulo.sku = articulo.sku;
      newMovimientoArticulo.cantMovimiento = articulo.CantMovimiento;
      movimientosArticulos.push(newMovimientoArticulo);
    }
    );

    newMovimiento.totalPiezas = this.conteo;
    newMovimiento.movimientoArticulos = movimientosArticulos;


    console.log(newMovimiento);
    this.movientosService.addMovimiento(newMovimiento).subscribe(response => {
      console.log(response);
      if (response.exito) {
        this.hideDialog();
        //limpiamos todos los objetos del envio
        this.ubicacionDeSeleccionada = new UbicacionModel();
        this.selectedArticulos = [];
        this.movimiento= new MovimientosInventarioModel();
        this.tipoPaquete=''
        this.conteo=null
        this.toastr.success("Envio Registrado Correctamente", 'Correcto');
        setTimeout(() => {
          this.saveEnvio.emit(true);
        }, 100);
      }
    }, err => {
      this.toastr.error("Error", 'Error en los servicios');
    });
  }






}
