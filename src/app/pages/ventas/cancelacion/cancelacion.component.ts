import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CambiosDevolucionesModel, CambiosDevolucionesArticuloModel } from '../../../models/cambios-devoluciones.model';
import { Subscription } from 'rxjs';
import { VariablesService } from '../../../services/variablesGL.service';
import { VentaModel, VentaArticuloModel } from '../../../models/venta.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { imagen64 } from '../../inventario/inventario.component';
import { productoModel } from '../../../models/productos.model';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ToastrService } from 'ngx-toastr';
import { VentasService } from '../../../services/ventas.service';

@Component({
  selector: 'app-cancelacion',
  templateUrl: './cancelacion.component.html',
  styleUrls: ['./cancelacion.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class CancelacionComponent implements OnInit, OnDestroy {
  @Input() _accion: string;
  @Input() _details: CambiosDevolucionesModel;
  @Input() _allCambiosDevoluciones: CambiosDevolucionesModel[];
  @Output() saveCambioDevolucion: EventEmitter<boolean> = new EventEmitter<boolean>();

  accion: string;
  noTicketVenta: string = '';
  visibleDialog: boolean;
  dialogSubscription: Subscription;

  loadResultVenta: boolean;
  ventaArticleSelected: VentaArticuloModel;
  overlayProductos: OverlayPanel;
  ventaByNoTicket: VentaModel[] = [];
  cambiosDevoluciones: CambiosDevolucionesModel[] = [];
  detailsCambiosDevoluciones: CambiosDevolucionesModel[] = [];
  cambioDevolucion: CambiosDevolucionesModel;

  margin_l = '-25.5rem';
  margin_t = '3rem';
  rows: number;
  constructor(
    private toastr: ToastrService,
    private ventasService: VentasService,
    private variablesGL: VariablesService,
    private cambioDevolucionService: VentasService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
      if(this._accion){
        this.accion = this._accion;
        this.initVariables();
      }
      if(this._details){
        this.detailsCambiosDevoluciones.push(this._details);
      }
    });
    let status = variablesGL.getPantalla();
    if(status == 'monitor'){
      this.margin_l = '9rem';
      this.margin_t = '10rem';
    }
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

  ngOnDestroy(): void {
    if(this.dialogSubscription){
      this.dialogSubscription.unsubscribe();
    }
  }

  initVariables(){
    this.noTicketVenta = '';
    this.ventaByNoTicket = [];
    this.cambioDevolucion = null;
    this.cambiosDevoluciones = [];
    this.detailsCambiosDevoluciones = [];
  }

  findSale(event: any){

    if(event?.key == 'Enter' || event == null){
      if(this.ventaByNoTicket.length == 0){



          this.loadResultVenta = true;

          this.ventasService.searchVentaByNoTicket(this.noTicketVenta).subscribe(response => {
              console.log('resultados de la busqueda -> ', response);
              if(response.exito){
                this.toastr.success(response.mensaje, 'Success!');
                this.ventaByNoTicket = response.respuesta;
                this.ventaByNoTicket[0].fecha =this.ventaByNoTicket[0].fecha;
              }else{
                this.toastr.warning(response.mensaje, 'Error!');
              }
              this.loadResultVenta = false;
          }, err => {
            this.toastr.error('Ocurrió un error, comuniquese con el administrador', 'Error!');
            this.loadResultVenta = false;
          });
          // let result = new VentaModel();
          // setTimeout(() => {
          //   this.ventaByNoTicket.push(result);
          //   this.loadResultVenta = false;
          // }, 800);


      }else{
        this.toastr.error('Ya se han cargado los datos de la venta...', 'Error!');
      }
    }

  }

  hideDialog(){
    this.variablesGL.showDialog.next(false);
  }

  changeArticle(event: any, panel: OverlayPanel, ventaArticulo: VentaArticuloModel){
    console.log('data cambio devolucion -> ', this.cambioDevolucion);
    console.log('data venta by ticket -> ', this.ventaByNoTicket[0]);

      this.overlayProductos = panel;
      this.ventaArticleSelected = ventaArticulo;
      //Aqui se verifica que solo se puedan hacer cambios respecto a la cantidad de articulos vendidos
      //cada cambio reduce la cantidad de los vendidos
      if(this.cambioDevolucion){
        if(this.ventaArticleSelected.cantidad == 0){
          this.toastr.error('Se han realizado todos los cambios posibles de éste articulo...','Error!');
          return;
        }
      }

      this.overlayProductos.show(event);


  }


  onSaveCambioDevolucion(){
    console.log('CambiosDevolucionModel --> ',this.ventaByNoTicket);
    let cambioDevolucionRequest = {...this.cambioDevolucion};
    cambioDevolucionRequest.fecha = this.variablesGL.setFormatoFecha(cambioDevolucionRequest.fecha);



      console.log('CambiosDevolucionModel --> ',cambioDevolucionRequest);
      this.ventaByNoTicket[0].fecha=this.ventaByNoTicket[0].fecha
      this.cambioDevolucionService.postCancelacion(this.ventaByNoTicket[0]).subscribe(response => {
        console.log('data respuesta cambio devolucion ', response);
        if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!');
          this.variablesGL.showDialog.next(false);
          this.initVariables();
          this.saveCambioDevolucion.emit(true);
        }else{
          this.toastr.error(response.mensaje, 'Error!');
          this.initVariables();
        }
      })

  }

  setArticulosCambioDevolucion(newArticulo: productoModel){
      //Si el articulo no existe lo agrega, si existe aumenta la cantidad
      if(!this.cambioDevolucion.cambiosDevolucionesArticulos.find(x => x.idArticulo == newArticulo.idArticulo)){
          this.cambioDevolucion.cambiosDevolucionesArticulos.push(
          {
            idCambioArticulo: 0,
            idCambioDevolucion: 0,
            idVentaArticulo: this.ventaArticleSelected.idVentaArticulo,
            idArticulo: newArticulo.idArticulo,
            cantidad: 1,
            estado: 'CAMBIO',
            motivoCambio: 'Cambio por otro articulo de talla',
            precioAnterior: this.ventaArticleSelected.precioUnitario,
            precioActual: newArticulo.precio,
            deducible: newArticulo.precio - this.ventaArticleSelected.precioUnitario,
            articulo: newArticulo,
            ventaArticulo: this.ventaArticleSelected
          });
          this.cambioDevolucion.subtotal += (newArticulo.precio - this.ventaArticleSelected.precioUnitario);
          this.cambioDevolucion.total = this.cambioDevolucion.subtotal;
      }else{
        this.cambioDevolucion.cambiosDevolucionesArticulos.find(x => x.idArticulo == newArticulo.idArticulo).cantidad++;
        const newDeducible = newArticulo.precio - this.ventaArticleSelected.precioUnitario;
        this.cambioDevolucion.cambiosDevolucionesArticulos.find(x => x.idArticulo == newArticulo.idArticulo).deducible += newDeducible;
        this.cambioDevolucion.subtotal += newDeducible;
        this.cambioDevolucion.total = this.cambioDevolucion.subtotal;
      }

     // this.actualizaCambiosDevolucionesArticulo();
  }




}
