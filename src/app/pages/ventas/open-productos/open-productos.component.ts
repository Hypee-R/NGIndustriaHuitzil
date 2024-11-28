import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from '../../../services/ventas.service';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { TallasService } from 'src/app/services/tallas.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { Console } from 'console';
@Component({
  selector: 'app-open-productos',
  templateUrl: './open-productos.component.html',
  styleUrls: ['./open-productos.component.css']
})
export class OpenProductosComponent implements OnInit {

  @Input() _accion: string;
  @Input() _articles: productoModel[];
  @Input() _articlesSelected: productoModel[];
  @Input() _nArticles: number;
  @Output() _articulosS = new EventEmitter<productoModel>();
  loading: boolean = false;
  rows = 0;
  accion = '';
  submitted = false;
  visibleDialog = true;
  queryString: string = '';
  articlesSelected: productoModel[] = [];
  articles: productoModel[] = [];
  colsProducts: any[] = [];
  dialogSubscription: Subscription = new Subscription();
  articlesAddSales = 0;

  // Filtros de columna
  filterSKU: string = '';
  filterDescripcion: string = '';
  filterTalla: string = '';
  filterUbicacion: string = '';
  //
  listTallas: any[] = [];
  tallaOptions: any[] = [];

  listCategorias: any[] = [];
  categoriaOptions: any[] = [];

  listUbicaciones: any[] = [];
  ubicacionOptions: any[] = [];

   // Modelo de filtros
   filterModel = {
    sku: '',
    descripcion: '',
    talla: null, // Aquí será el id de la talla seleccionada
    categoria: null, // Aquí será el id de la categoría seleccionada
    ubicacion: this.variablesGL.getSucursal()
  };
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private tallasService: TallasService,
    private categoriasService: CategoriasService,
    private UbicacionesService: UbicacionesService
  ) {
    this.colsProducts = [
     // { field: 'imagen', header: 'Imagen' },
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Producto' },
      { field: 'talla', header: 'Talla' },
      { field: 'existencia', header: 'Cantidad' },
      { field: 'precio', header: 'Precio' },
    
    ];

    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
      if (this.visibleDialog) {
        if (this._accion) {
          this.accion = this._accion;
        }

        this.articles = this._articles;
        this.articlesSelected = this._articlesSelected;
        this.articlesAddSales = this._nArticles;
      }
    });

    let status = this.variablesGL.getPantalla();
    if (status == 'celular') {
      this.rows = 4;
    } else if (status == 'tablet') {
      this.rows = 4;
    } else if (status == 'laptop') {
      this.rows = 6;
    } else {
      this.rows = 11;
    }
  }

  ngOnInit(): void {
    // this.getUbicaciones();
    this.getCategorias();
    this.getTallas();

  }

  getFilteredResults() {
    console.log('getFilteredResults llamado');

    const filters = {
      queryString: '',
     // sucursal: this.variablesGL.getSucursal(),
      // sku: this.filterModel.sku ? this.filterModel.sku.trim() : '',
      // descripcion: this.filterModel.descripcion ? this.filterModel.descripcion.trim() : '',
      talla: this.filterModel.talla ? this.filterModel.talla : null,
      categoria: this.filterModel.categoria ? this.filterModel.categoria : null,
      ubicacion: this.variablesGL.getSucursal(),
      page: 0,
      size: 100
    };

    this.variablesGL.showLoading();
    this.inventarioService.searchProductDemanda(filters).subscribe(response => {
      if (response.exito) {
        this.articles = response.respuesta;
        console.log('resultados filtrados: ', this.articles);
        this.variablesGL.hideLoading();
      } else {
        this.variablesGL.hideLoading();
        this.toastr.error(response.mensaje, 'Error!');
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al buscar los productos', 'Error!');
      console.log(err);
    });
  }


  // getUbicaciones() {
  //   this.loading = true;
  //   this.UbicacionesService.getUbicaciones().subscribe(response => {
  //     if (response.exito) {
  //       this.listUbicaciones = response.respuesta;
  //       // Transformar los datos en un formato adecuado para el p-dropdown
  //       this.ubicacionOptions = this.listUbicaciones.map(ubicacion => ({
  //         label: ubicacion.direccion, // O usa `ubicacion.nombre` si prefieres mostrar el nombre
  //         value: ubicacion.direccion
  //       }));
  //       console.log(this.ubicacionOptions);
  //       this.loading = false;
  //     } else {
  //       this.loading = false;
  //       // Manejo de error si es necesario
  //     }
  //   }, err => {
  //     this.loading = false;
  //     // Manejo de error si es necesario
  //   });
  // }

  getCategorias() {
    this.loading = true;
    this.categoriasService.getCategorias().subscribe(response => {
      if (response.exito) {
        this.listCategorias = response.respuesta;
        // Transformar los datos en un formato adecuado para el p-dropdown
        this.categoriaOptions = this.listCategorias.map(categoria => ({
          label: categoria.descripcion, // O usa `categoria.descripcion` si prefieres mostrar la descripción
          value: categoria.idCategoria
        }));
        console.log(this.categoriaOptions);
        this.loading = false;
      } else {
        this.loading = false;
        // Manejo de error si es necesario
      }
    }, err => {
      this.loading = false;
      // Manejo de error si es necesario
    });
  }
  getTallas() {
    this.loading = true;
    this.tallasService.getTallas().subscribe(response => {
      if (response.exito) {
        this.listTallas = response.respuesta;
        // Transformar los datos en un formato adecuado para el p-dropdown
        this.tallaOptions = this.listTallas.map(talla => ({
          label: talla.nombre, // O usa `talla.descripcion` si prefieres mostrar la descripción
          value: talla.idTalla
        }));
        console.log(this.tallaOptions);
        this.loading = false;
      } else {
        this.loading = false;
        // Manejo de error si es necesario
      }
    }, err => {
      this.loading = false;
      // Manejo de error si es necesario
    });
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
      this.articlesSelected = [];
    }
  }

  hideDialog() {
    this.submitted = false;
    this.articlesSelected = [];
    this.variablesGL.showDialog.next(false);
  }

  getResults() {
    if (this.queryString.trim().length > 0) {
      this.variablesGL.showLoading();
      this.inventarioService.searchProductDemanda({
        queryString: this.queryString.trim(),
        sucursal: this.variablesGL.getSucursal(),
        page: 0, // Página inicial
        size: 10 // Número de artículos por página
      }).subscribe(response => {
        if (response.exito) {
          this.variablesGL.hideLoading();
          this.toastr.success(response.mensaje, 'Éxito!!!');
          this.articles = response.respuesta;
          console.log('resultados de la búsqueda: ', this.articles);
        } else {
          this.variablesGL.hideLoading();
          this.toastr.error(response.mensaje, 'Error!');
        }
      }, err => {
        this.variablesGL.hideLoading();
        this.toastr.error('Hubo un error al buscar los productos', 'Error!');
      });
    } else {
      this.toastr.error('Ingrese un elemento de búsqueda', 'Atención!');
    }
  }

  filterByField(field: string, value: string) {
    // Actualiza el valor del filtro correspondiente


    // Llama al método para obtener los resultados filtrados
    console.log(field,value)
    this.getFilteredResults();
  }

  filterByDropdown(field: string, value: any) {
    this.filterByField(field, value);
  }
  // getFilteredResults() {
  //   console.log('getFilteredResults llamado');
  //   const filters = {
  //     queryString: '', // O dejar vacío si no se usa
  //     sucursal: this.variablesGL.getSucursal(),
  //     sku: this.filterSKU.trim(),
  //     descripcion: this.filterDescripcion.trim(),
  //     talla: this.filterTalla.trim(),
  //     ubicacion: this.filterUbicacion.trim(),
  //     page: 0, // Página inicial
  //     size: 100 // Número de artículos por página
  //   };

  //   this.variablesGL.showLoading();
  //   this.inventarioService.searchProductDemanda(filters).subscribe(response => {
  //     if (response.exito) {
  //       this.articles = response.respuesta;
  //       console.log('resultados filtrados: ', this.articles);
  //       this.variablesGL.hideLoading();
  //       setTimeout(() => {
  //         this.variablesGL.showDialog.next(true);
  //       }, 100);
  //     } else {
  //       this.variablesGL.hideLoading();
  //       this.toastr.error(response.mensaje, 'Error!');
  //     }
  //   }, err => {
  //     this.variablesGL.hideLoading();
  //     this.toastr.error('Hubo un error al buscar los productos', 'Error!');
  //     console.log(err);
  //   });
  // }

  addProduct(product: productoModel) {
    this.articlesAddSales += 1;
    this._articulosS.emit(product);
  }

  closeModal() {
    this.variablesGL.showDialog.next(false);
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
