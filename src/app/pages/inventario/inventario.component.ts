import { Component, OnInit } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model.';
/*import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';*/
//import { CatProveedorModel } from 'src/app/models/proveedores.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoriasService } from 'src/app/services/categorias.service';
import { TallasService } from 'src/app/services/tallas.service';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { CategoriaModel } from 'src/app/models/categoria.model';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit {
  productDialog: boolean;
  products: any ;
  product: any;
  selectedProducts: any;
  submitted: boolean;
  statuses: any[];
  statusPantalla: number;
  loading: boolean = false;
  listArticulos: productoModel[] = [];
  listTallas:CatTallaModel[]=[];
  listUbicaciones:UbicacionModel[]=[];
  listCategorias:CategoriaModel[]=[];
  selectedArticulo: productoModel = new productoModel();
  selectedArticulos: productoModel[];
  
  accion = '';
  rows = 0;
  cols: any[] = [];
 /* constructor( private messageService: MessageService, private confirmationService: ConfirmationService) { }*/
 constructor(
    public variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private toastr: ToastrService,
    private categoriaService:CategoriasService,
    private tallasService:TallasService,
    private ubicacionesService:TallasService
    
  ) {

    
    this.cols = [
      { field: 'idArticulo', header: 'ID' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'existencia', header: 'Existencia' },
      { field: 'fechaIngreso', header: 'Fecha Ingreso' },
      { field:'categoria',header:'Categoria'},
      { field: 'unidad', header: 'Unidad' },
      { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
    
    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
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
  ngOnInit() {
    //  this.productService.getProducts().then(data => this.products = data);

      this.statuses = [
          {label: 'INSTOCK', value: 'instock'},
          {label: 'LOWSTOCK', value: 'lowstock'},
          {label: 'OUTOFSTOCK', value: 'outofstock'}
      ];

      this.getArticulos();
  }

  openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }

  getArticulos(){
    this.loading = true;
    /*this.tallasService.getTallas().subscribe(response => {
      if(response.exito){
        this.listTallas = response.respuesta;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    });*/
    this.inventarioService.getArticulos().subscribe(response => {
      if(response.exito){
        this.listArticulos = response.respuesta;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    });

  

    
}
 /* deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected products?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => !this.selectedProducts.includes(val));
              this.selectedProducts = null;
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
          }
      });
  }*/

  editProduct() {
      this.product = {};
      this.productDialog = true;
  }

  /*deleteProduct(product: any) {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete ' + product.name + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => val.id !== product.id);
              this.product = {};
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }

  saveProduct() {
      this.submitted = true;

      if (this.product.name.trim()) {
          if (this.product.id) {
              this.products[this.findIndexById(this.product.id)] = this.product;
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
          }
          else {
              this.product.id = this.createId();
              this.product.image = 'product-placeholder.svg';
              this.products.push(this.product);
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
      }
  }*/

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string {
      let id = '';
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( var i = 0; i < 5; i++ ) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }
////Agregar nuevo componete

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedArticulo = new productoModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  /// Editar componetente
  editArticulo(producto: productoModel){
    console.log(producto)
    this.accion = 'Actualizar';
    this.selectedArticulo = {...producto};
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  ///Eliminar componetne

  deleteArticulo(articulo: productoModel){
    Swal.fire({
      title: `Está seguro de eliminar el proveedor ${articulo.descripcion}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(proveedor);

        this.inventarioService.eliminaArticulo(articulo).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.getArticulos();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina proveedor ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }
}
