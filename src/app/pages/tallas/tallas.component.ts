import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { TallasService } from 'src/app/services/tallas.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-tallas',
  templateUrl: './tallas.component.html',
  styleUrls: ['./tallas.component.css']
})
export class TallasComponent implements OnInit {

  rows = 0;
  accion = '';
  cols: any[] = [];
  statusPantalla: number;
  loading: boolean = false;
  selectedTalla: CatTallaModel = new CatTallaModel();
  selectedTallas: CatTallaModel[];
  listTallas: CatTallaModel[] = [];
  constructor(
    public variablesGL: VariablesService,
    private tallasService: TallasService,
    private toastr: ToastrService,
  ) {
    this.cols = [
      
      { field: 'idTalla', header: 'idTalla' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
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

  ngOnInit(): void {
    this.getTallas();
  }

  getTallas(){
      this.loading = true;
      this.tallasService.getTallas().subscribe(response => {
        if(response.exito){
          this.listTallas = response.respuesta;
          console.log(  this.listTallas);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedTalla = new CatTallaModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  editTalla(talla: CatTallaModel){
    this.accion = 'Actualizar';
    this.selectedTalla = {...talla};
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  deleteTalla(talla: CatTallaModel){
    Swal.fire({
      title: `Está seguro de eliminar la talla ${talla.nombre}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(talla);

        this.tallasService.eliminaTalla(talla).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.getTallas();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina talla ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

  deleteSelectedTallas(){
    Swal.fire({
      title: `Está seguro de eliminar las ${this.selectedTallas.length} tallas?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
          this.selectedTallas.forEach(us => {
              this.tallasService.eliminaTalla(us).subscribe();
          });
      } else if (result.isDenied) {

      }
    });
  }


}
