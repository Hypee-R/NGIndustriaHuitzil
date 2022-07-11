import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit {
  
    rows = 0;
    accion = '';
    cols: any[] = [];
    statusPantalla: number;
    loading: boolean = false;
    selectedTalla: UbicacionModel = new UbicacionModel();
    selectedTallas: UbicacionModel[];
    listTallas: UbicacionModel[] = [];
    constructor(
      public variablesGL: VariablesService,
      private UbicacionesService: UbicacionesService,
      private toastr: ToastrService,
    ) {
      this.cols = [
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
        this.UbicacionesService.getUbicaciones().subscribe(response => {
          if(response.exito){
            this.listTallas = response.respuesta;
            this.loading = false;
          }
        }, err => {
          this.loading = false;
        });
    }
  
    openModalAdd(){
      this.accion = 'Agregar';
      this.selectedTalla = new UbicacionModel();
      setTimeout(() => {
        this.variablesGL.showDialog.next(true);
      }, 100);
    }
  
    editTalla(talla: UbicacionModel){
      this.accion = 'Actualizar';
      this.selectedTalla = {...talla};
      setTimeout(() => {
        this.variablesGL.showDialog.next(true);
      }, 100);
    }
  
    deleteTalla(talla: UbicacionModel){
      Swal.fire({
        title: `Está seguro de eliminar la talla ${talla.direccion}?`,
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(talla);
  
          this.UbicacionesService.eliminaUbicacion(talla).subscribe(response => {
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
                this.UbicacionesService.eliminaUbicacion(us).subscribe();
            });
        } else if (result.isDenied) {
  
        }
      });
    }
  
  
  }
  