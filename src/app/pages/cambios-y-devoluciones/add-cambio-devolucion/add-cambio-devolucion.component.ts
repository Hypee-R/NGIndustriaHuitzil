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
  selector: 'app-add-cambio-devolucion',
  templateUrl: './add-cambio-devolucion.component.html',
  styleUrls: ['./add-cambio-devolucion.component.css'],
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
export class AddCambioDevolucionComponent implements OnInit, OnDestroy {
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

        let existeCambio = this._allCambiosDevoluciones.find(x => x.venta.noTicket == this.noTicketVenta);
        if(!existeCambio){

          this.loadResultVenta = true;

          this.ventasService.searchVentaByNoTicket(this.noTicketVenta).subscribe(response => {
              // console.log('resultados de la busqueda -> ', response);
              if(response.exito){
                this.toastr.success(response.mensaje, 'Success!');
                this.ventaByNoTicket = response.respuesta;
                this.ventaByNoTicket[0].fecha = this.variablesGL.getFormatoFecha(this.ventaByNoTicket[0].fecha).toString();
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
          this.toastr.error('La venta ya tiene algún cambio realizado','Error!');
        }
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


    //Solo se hara si la cantidad de cambios no excede la cantidad de articulos vendidos
    if(!this.cambioDevolucion || this.cambioDevolucion.noArticulos < this.ventaByNoTicket[0].noArticulos){
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

    }else{
      //Mandar mensaje de se han cambiado todos los articulos
      this.toastr.error('Se han cambiado todos los articulos posibles...','Error!');
    }
  }

  onSetChangeArticle(newArticulo: productoModel){
    if(newArticulo){
        // console.log('Cambiar articulo -> ', this.ventaArticleSelected.articulo);
        // console.log('Por articulo -> ', newArticulo);
        if(!this.cambioDevolucion){
            this.ventaArticleSelected.cantidad--;
            this.cambioDevolucion = new CambiosDevolucionesModel();
            this.cambioDevolucion.idCambioDevolucion = 0;
            this.cambioDevolucion.idVenta = this.ventaByNoTicket[0].idVenta;
            this.cambioDevolucion.fecha = Date.now().toString();
            this.cambioDevolucion.noArticulos = 1;
            this.cambioDevolucion.cambiosDevolucionesArticulos = [];
            this.cambioDevolucion.cambiosDevolucionesArticulos.push(
            {
              idCambioArticulo: 0,
              idCambioDevolucion: 0,
              idVentaArticulo: this.ventaArticleSelected.idVentaArticulo,
              idArticulo: newArticulo.idArticulo,
              cantidad: 1,
              estado: 'CAMBIO',
              motivoCambio: 'Cambio por otro articulo',
              precioAnterior: this.ventaArticleSelected.precioUnitario,
              precioActual: newArticulo.precio,
              deducible: newArticulo.precio - this.ventaArticleSelected.precioUnitario,
              articulo: newArticulo,
              ventaArticulo: this.ventaArticleSelected
            });
            this.cambioDevolucion.subtotal = newArticulo.precio - this.ventaArticleSelected.precioUnitario;
            this.cambioDevolucion.total = this.cambioDevolucion.subtotal;
            this.cambiosDevoluciones.push(this.cambioDevolucion);

            this.actualizaCambiosDevolucionesArticulo();

        }else{
            this.ventaArticleSelected.cantidad--;
            this.cambioDevolucion.noArticulos++;
            this.cambioDevolucion.fecha = Date.now().toString();
            this.setArticulosCambioDevolucion(newArticulo);
        }

        this.overlayProductos.hide();
    }
  }

  onSaveCambioDevolucion(){
    let cambioDevolucionRequest = {...this.cambioDevolucion};
    cambioDevolucionRequest.fecha = this.variablesGL.setFormatoFecha(cambioDevolucionRequest.fecha);
    cambioDevolucionRequest.cambiosDevolucionesArticulos.forEach(cambio => {
      //cambio.articulo = null;
      cambio.ventaArticulo.cambiosArticulo = null;
    });
      console.log('CambiosDevolucionModel --> ',cambioDevolucionRequest);

      this.cambioDevolucionService.postCambiosDevoluciones(cambioDevolucionRequest).subscribe(response => {
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

      this.actualizaCambiosDevolucionesArticulo();
  }

  actualizaCambiosDevolucionesArticulo(){
    // console.log('Cambio devolucion', this.cambioDevolucion);
    let cambiosArticulo = this.cambioDevolucion.cambiosDevolucionesArticulos.filter(x => x.ventaArticulo.idArticulo == this.ventaArticleSelected.idArticulo);
    this.ventaByNoTicket[0].ventaArticulo.find(x => x.idArticulo == this.ventaArticleSelected.idArticulo).cambiosArticulo = cambiosArticulo;
  }

  onDeleteArticuloCambio(deleteCambio: CambiosDevolucionesArticuloModel){
    console.log('delete articulo cambio', deleteCambio.idArticulo);
    console.log('del articulo venta ', deleteCambio.ventaArticulo.idArticulo);

    this.ventaArticleSelected = deleteCambio.ventaArticulo;

    if(deleteCambio.cantidad > 1){
      this.cambioDevolucion.cambiosDevolucionesArticulos.find(x => x.idArticulo == deleteCambio.idArticulo).cantidad--;
    }else{
      let idxCambioArticuloDelete = this.cambioDevolucion.cambiosDevolucionesArticulos.findIndex(x => x.idArticulo == deleteCambio.idArticulo);
      this.cambioDevolucion.cambiosDevolucionesArticulos.splice(idxCambioArticuloDelete, 1);
    }

    this.cambioDevolucion.subtotal = this.cambioDevolucion.subtotal - (deleteCambio.precioActual - deleteCambio.precioAnterior);
    this.cambioDevolucion.total = this.cambioDevolucion.subtotal;

    this.actualizaCambiosDevolucionesArticulo();
    this.ventaByNoTicket[0].ventaArticulo.find(x => x.idArticulo == deleteCambio.ventaArticulo.idArticulo).cantidad++;

    this.cambioDevolucion.noArticulos--;
    if(this.cambioDevolucion.noArticulos == 0){
      this.cambioDevolucion = null;
      this.cambiosDevoluciones = [];
    }


    // if(cambio.cantidad == 1){
    //   let idxDelete = this.cambioDevolucion.cambiosDevolucionesArticulos.findIndex(x => x.idArticulo == this.ventaArticleSelected.idArticulo);
    //   this.cambioDevolucion.cambiosDevolucionesArticulos.splice(idxDelete, 1);
    // }else if(cambio.cantidad > 1){
    //   cambio.cantidad--;
    // }

    // //Actualiza total y subtotal
    // this.cambioDevolucion.subtotal = this.cambioDevolucion.subtotal - (cambio.precioActual - cambio.precioAnterior);
    // this.cambioDevolucion.total = this.cambioDevolucion.subtotal;

    // this.ventaByNoTicket[0].ventaArticulo.find(x => x.idArticulo == cambio.ventaArticulo.idArticulo).cantidad++;
    // this.actualizaCambiosDevolucionesArticulo();

    // this.cambioDevolucion.noArticulos--;
    // if(this.cambioDevolucion.noArticulos == 0){
    //   this.cambioDevolucion = null;
    //   this.cambiosDevoluciones = [];
    // }

  }

}
