import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from '../../../services/ventas.service';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { InventarioModel } from 'src/app/models/Inventario.model';
import { PreciosService } from 'src/app/services/precios.service';
@Component({
  selector: 'app-open-inventarios',
  templateUrl: './open-inventarios.component.html',
  styleUrls: ['./open-inventarios.component.css'],
})
export class OpenInventariosComponent implements OnInit {
  @Input() _accion: string;
  @Input() _articles: productoModel[];
  @Input() _articlesSelected: productoModel[];
  @Input() _nArticles: number;
  @Output() _articulosS = new EventEmitter<productoModel>();
  @Output() _inventarioSelected = new EventEmitter<InventarioModel>();

  loading: boolean = false;
  rows = 0;
  accion = '';
  submitted = false;
  visibleDialog = true;
  queryString: string = '';
  articlesSelected: productoModel[] = [];
  articles: productoModel[] = [];

  dialogSubscription: Subscription = new Subscription();
  precios: any[] = [];
  precio: any;
  selectedInvetario: InventarioModel;
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private preciosService: PreciosService
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(
      (estado) => {
        this.visibleDialog = estado;

        if (this.visibleDialog) {
          this.getPrecios();
        }
      }
    );

    let status = this.variablesGL.getPantalla();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
      this.articlesSelected = [];
    }
  }

  hideDialog() {
    this.submitted = false;
    this.variablesGL.showDialog.next(false);
  }

  getPrecios() {
 
    this.preciosService.getPrecios().subscribe(
      (response) => {
        if (response.exito) {
   this.precios = [];
          response.respuesta.forEach(precio => {
            if(precio.status){
              var precios = {
                value: precio.idLista,
                descripcion: precio.nombre,
              };

              this.precios.push(precios);
            }
          })
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  getResults() {
    if (this.queryString && this.queryString.trim().length > 0) {
      this.variablesGL.showLoading();
      this.inventarioService.searchProduct(this.queryString).subscribe(
        (response) => {
          if (response.exito) {
            this.variablesGL.hideLoading();

            this.toastr.success(response.mensaje, 'Exito!!!');
            this.articles = response.respuesta;
            console.log('resultados de la busqueda: ', this.articles);
          } else {
            this.variablesGL.hideLoading();
            this.toastr.error(response.mensaje, 'Error!');
          }
        },
        (err) => {
          this.variablesGL.hideLoading();
          this.toastr.error('Hubo un error al buscar los productos', 'Error!');
        }
      );
    } else {
      this.toastr.error('Ingrese un elemento de busqueda', 'Atención!');
    }
  }

  addProduct(product: productoModel) {
    //this.articlesAddSales += 1
    this._articulosS.emit(product);
  }

  closeModal() {
    if (this.precio != undefined) {
      this._inventarioSelected.emit(this.precio);
      this.variablesGL.showDialog.next(false);
    } else {
      this.toastr.error('Seleccione un inventario', 'Aviso');
    }
  }

  reduceList() {
    this.articlesSelected = this.articlesSelected.reduce((acc, item) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);
  }
}
