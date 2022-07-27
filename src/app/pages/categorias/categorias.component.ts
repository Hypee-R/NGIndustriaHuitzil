import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { CategoriaModel } from 'src/app/models/categoria.model';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { CategoriasService } from 'src/app/services/categorias.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  rows = 0;
  accion = '';
  cols: any[] = [];
  statusPancategoria: number;
  loading: boolean = false;
  selectedcategoria: CategoriaModel = new CategoriaModel();
  selectedcategoriaes: CategoriaModel[];


  listcategorias: CategoriaModel[] = [];
  constructor(
    public variablesGL: VariablesService,
    private categoriasService: CategoriasService,
    private toastr: ToastrService,
  ) {
    this.cols = [
      { field: 'idCategoria', header: 'idCategoria' },
      { field: 'nombre', header: 'nombre' },
      { field: 'descripcion', header: 'descripcion' },
      
    ];
    this.statusPancategoria = this.variablesGL.getStatusPantalla();
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

  ngOnInit(): void {
    this.getcategorias();
  }
  getcategorias(){
    this.loading = true;
    this.categoriasService.getCategorias().subscribe(response => {
      if(response.exito){
        this.listcategorias = response.respuesta;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    });
}

openModalAdd(){
  this.accion = 'Agregar';
  this.selectedcategoria = new CategoriaModel();
  setTimeout(() => {
    this.variablesGL.showDialog.next(true);
  }, 100);
}

editcategoria(categoria: CategoriaModel){
  this.accion = 'Actualizar';
  this.selectedcategoria = {...categoria};
  setTimeout(() => {
    this.variablesGL.showDialog.next(true);
  }, 100);
}

deletecategoria(categoria: CategoriaModel){
  Swal.fire({
    title: `Está seguro de eliminar la categoria ${categoria.nombre}?`,
    icon: 'question',
    showDenyButton: true,
    confirmButtonText: 'Guardar',
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(categoria);

      this.categoriasService.eliminacategoria(categoria).subscribe(response => {
        if(response.exito){
            this.toastr.success(response.mensaje, 'Exito!!');
            this.getcategorias();
        }else{
            this.toastr.error(response.mensaje, 'Ups!!');
        }
      }, err => {
        console.log('error elimina categoria ', err);
        this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
      });
    } else if (result.isDenied) {

    }
  });
}

deleteSelectedcategorias(){
  Swal.fire({
    title: `Está seguro de eliminar las ${this.selectedcategoriaes.length} categorias?`,
    icon: 'question',
    showDenyButton: true,
    confirmButtonText: 'Guardar',
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
        this.selectedcategoriaes.forEach(us => {
            this.categoriasService.eliminacategoria(us).subscribe();
        });
    } else if (result.isDenied) {

    }
  });
}


}
