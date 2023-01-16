import { Component, OnInit } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model';
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

export interface imagen64 {
  id: number,
  imagen64c: string
}

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
  statusPantalla: number;
  loading: boolean = false;
  listArticulos: productoModel[] = [];
  listTallas:CatTallaModel[]=[];
  listUbicaciones:UbicacionModel[]=[];
  listCategorias:CategoriaModel[]=[];
  selectedArticulo: productoModel = new productoModel();
  selectedArticulos: productoModel[];
  imagenes:imagen64[]=[]

  accion = '';
  rows = 0;
  cols: any[] = [];
 /* constructor( private messageService: MessageService, private confirmationService: ConfirmationService) { }*/
 constructor(
    public variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private toastr: ToastrService,


  ) {


    this.cols = [
      // { field: 'idArticulo', header: 'ID' },
      { fiel:'',header:'Imagen'},
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'existencia', header: 'Existencia' },
      // { field: 'fechaIngreso', header: 'Fecha Ingreso' },
      // { field:'categoria',header:'Categoria'},
      // { field: 'unidad', header: 'Unidad' },
      { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
      { field: 'precio',header:'precio'},

    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 5;
    }else{
      this.rows = 11;
    }
  }
  ngOnInit() {
      this.getArticulos();

  }

  openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }


  getArticulos(){
    this.loading = true;
    this.inventarioService.getArticulos().subscribe(response => {
      if(response.exito){
        this.listArticulos = response.respuesta;
        // console.log('articulos ', this.listArticulos);
        this.loading = false;
        for(let art of this.listArticulos){
          this.imagenes.push({id:art.idArticulo,imagen64c:art.imagen})
        }
      }
    }, err => {
      this.loading = false;
    });
}

  editProduct() {
      this.product = {};
      this.productDialog = true;
  }

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
    console.log(articulo)
    console.log(articulo.descripcion)
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
          //console.log('error elimina proveedor ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

}
