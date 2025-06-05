import Swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ProduccionService } from 'src/app/services/produccion.service';
import { CatProduccionCorteModel } from 'src/app/models/produccionCorte';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { CategoriasService } from 'src/app/services/categorias.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {
  @ViewChild('dt') table: Table;
  rows = 0;
   accion = '';
   cols: any[] = [];
   statusPantalla: number;
   loading: boolean = false;
   selectedProduccionCorte: CatProduccionCorteModel = new CatProduccionCorteModel();
   selectedProduccion: CatProduccionCorteModel[];
   listProduccion: CatProduccionCorteModel[] = [];
   articles: productoModel[] = [];
   articleProduccion: any[] = [];
   materialProduccion: any[] = [];
   showAdd: boolean = false;
   listCategorias: CategoriaModel[] = [];
    // listSubcategorias: SubCategoriaModel[] = [];
   categoriaSeleccionada: any;
   subCategoriaSelected: any;
   constructor(
     public variablesGL: VariablesService,
     private produccionService: ProduccionService,
      private inventarioService: InventarioService,
      private categoriesService: CategoriasService,
      // private subCategoriaService: SubCategoriasService,
      private toastr: ToastrService
   ) {
     this.cols = [
       { field: 'folio', header: 'Folio' },
       { field: 'responsable', header: 'Responsable' },
       { field: 'fechaInicio', header: 'Fecha Inicio' },
       { field: 'status', header: 'Status' },
       { field: 'comentarios', header: 'Comentario' },
     ];
     this.statusPantalla = this.variablesGL.getStatusPantalla();
     let status = this.variablesGL.getPantalla();
     if (status == 'celular') {
       this.rows = 6;
     } else if (status == 'tablet') {
       this.rows = 7;
     } else if (status == 'laptop') {
       this.rows = 4;
     } else {
       this.rows = 11;
     }
   }
 
   ngOnInit(): void {
     this.getProduccionCortes(true);
    // this.getArticulos();
     //this.getCategorias();
   }
 
   getProduccionCortes(hideLoading :boolean) {
     this.loading = true;
     this.produccionService.getProduccionCorte().subscribe(
       (response) => {
         if (response.exito) {
           this.listProduccion = response.respuesta;
           console.log('listProduccion', this.listProduccion);
           this.loading = hideLoading;
           this.loading = false;
         }
       },
       (err) => {
         this.loading = hideLoading;
       }
     );
   }

   getCategorias() {
    this.listCategorias = [];
    this.categoriesService.getCategorias().subscribe(
      (response) => {
        if (response.exito) {
          this.listCategorias.push(new CategoriaModel());
          for (let categoria of response.respuesta) {
            this.listCategorias.push(categoria);
          }
        }
      },
      (err) => { }
    );
  }

  filterstable(categoria: any) {
    this.categoriaSeleccionada = categoria;
    // this.listSubcategorias = [];
    this.subCategoriaSelected = undefined;
    this.table.filter('', 'categoria', 'contains');
    this.table.filter('', 'subcategoria', 'contains');
    if (categoria != null) {
      this.table.filter(categoria.nombre, 'categoria', 'contains');
      // this.subCategoriaService
      //   .getSubCategoriasByCategoria(categoria.idCategoria)
      //   .subscribe(
      //     (response) => {
      //       if (response.exito) {
      //         for (let sub of response.respuesta) {
      //           this.listSubcategorias.push(sub);
      //         }
      //       }
      //     },
      //     (err) => { }
      //   );
    } else {
      this.table.filter('', 'categoria', 'contains');
      this.table.filter('', 'subcategoria', 'contains');
      // this.listSubcategorias = [];
      this.table.reset();
    }
  }

  filterstableSub(subCategoria: any) {
    if (subCategoria != null) {
      this.table.filter(subCategoria.nombre, 'subcategoria', 'contains');
    } else {
      //this.table.reset();
      //this.listSubcategorias = []
    }
  }
 
   openModalAdd() {
    this.accion = 'Agregar';
    this.showAdd = true;
    this.selectedProduccionCorte = new CatProduccionCorteModel();
    this.selectedProduccionCorte.status = 'SIN INICIAR';
     setTimeout(() => {
       this.variablesGL.showDialog.next(true);
     }, 100);
   }
 
   editProduccion(produccion) {
    this.showAdd = true;
     this.accion = 'Actualizar';
     this.selectedProduccionCorte = { ...produccion };
     this.produccionService.getArticuloByOrder(produccion.idProduccion).subscribe(
      (response) => {
        if (response.exito) {
          this.articleProduccion = response.respuesta;
          setTimeout(() => {
            this.variablesGL.showDialog.next(true);
          }, 1000);
       
        }
      },
      (err) => {
        //this.loading = hideLoading;
      }  );

      this.produccionService.getMaterialesByOrder(produccion.idProduccion).subscribe(
        (response) => {
          if (response.exito) {
            this.materialProduccion = response.respuesta;
            setTimeout(() => {
              this.variablesGL.showDialog.next(true);
            }, 1000);
         
          }
        },
        (err) => {
          //this.loading = hideLoading;
        }
      );
    
   }
 
   deleteProd(produccionCorte: CatProduccionCorteModel) {
     Swal.fire({
       title: `Está seguro de eliminar el corte ${produccionCorte.folio}?`,
       icon: 'question',
       showDenyButton: true,
       confirmButtonText: 'Aceptar',
       denyButtonText: `Cancelar`,
     }).then((result) => {
       if (result.isConfirmed) {
         this.produccionService.eliminaProduccionCorte(produccionCorte).subscribe(
           (response) => {
             if (response.exito) {
               this.toastr.success(response.mensaje, 'Exito!!');
               this.getProduccionCortes(false);
               
               //this.getClientes();
             } else {
               this.toastr.error(response.mensaje, 'Ups!!');
             }
           },
           (err) => {
             console.log('error elimina el cliente ', err);
             this.toastr.error(
               'Hubo un problema al conectar con los servicios en linea',
               'Ups!!'
             );
           }
         );
       } else if (result.isDenied) {
       }
     });
   }
 
     deleteSelectedProd() {
      Swal.fire({
        title: `Está seguro de eliminar los ${this.selectedProduccion.length} Cortes?`,
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          const deletePromises = this.selectedProduccion.map((prod) =>
            this.produccionService.eliminaProduccionCorte(prod).toPromise()
          );
          Promise.all(deletePromises)
            .then(() => {
              this.getProduccionCortes(false);
              Swal.fire('Eliminados!', 'Los cortes seleccionados han sido eliminados.', 'success');
              this.selectedProduccion =[]
            })
            .catch((error) => {
              Swal.fire('Error', 'Hubo un error al eliminar los cortes.', 'error');
              console.error(error);  // Log error for debugging
            });
        }
      });
    }
   changeRowArticle(produccionCorte: CatProduccionCorteModel) {
     this.actualizarArticulo(produccionCorte);
   }
 
   actualizarArticulo(produccionCorte: CatProduccionCorteModel) {
     this.produccionService.actualizaProduccionCorte(produccionCorte).subscribe(
       (response) => {},
       (err) => {
         this.toastr.error(
           'Hubo un problema al conectar con los servicios en linea',
           'Ups!!'
         );
       }
     );
   }

   getArticulos() {
   // this.loading = false;
    // this.inventarioService.getArticulos().subscribe(
    //   (response) => {
    //     if (response.exito) {
    //       this.articles = response.respuesta;
    //       this.loading = false;
    //     }
    //   },
    //   (err) => {
    //     this.loading = false;
    //     this.toastr.error(
    //       'Hubo un problema al conectar con los servicios en linea',
    //       'Ups!!'
    //     );
    //   }
    // );
  }

}
