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
    statusPanubicacion: number;
    loading: boolean = false;
    selectedubicacion: UbicacionModel = new UbicacionModel();
    selectedubicaciones: UbicacionModel[];
 

    listubicacions: UbicacionModel[] = [];
    constructor(
      public variablesGL: VariablesService,
      private UbicacionesService: UbicacionesService,
      private toastr: ToastrService,
    ) {
      this.cols = [
        { field: 'idUbicacion', header: 'idUbicacion' },
        { field: 'direccion', header: 'direccion' },
        { field: 'nombreEncargado', header: 'nombreEncargado' },
        { field: 'apellidoPEncargado', header: 'apellidoPEncargado' },
        { field: 'apellidoMEncargado', header: 'apellidoMEncargado' },
        { field: 'telefono1', header: 'telefono1' },
        { field: 'telefono2', header: 'telefono2' },
        { field: 'correo', header: 'correo' },
      ];
      this.statusPanubicacion = this.variablesGL.getStatusPantalla();
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
      this.getubicacions();
    }
  
    getubicacions(){
        this.loading = true;
        this.UbicacionesService.getUbicaciones().subscribe(response => {
          if(response.exito){
            this.listubicacions = response.respuesta;
            this.loading = false;
          }
        }, err => {
          this.loading = false;
        });
    }
  
    openModalAdd(){
      this.accion = 'Agregar';
      this.selectedubicacion = new UbicacionModel();
      setTimeout(() => {
        this.variablesGL.showDialog.next(true);
      }, 100);
    }
  
    editubicacion(ubicacion: UbicacionModel){
      this.accion = 'Actualizar';
      this.selectedubicacion = {...ubicacion};
      setTimeout(() => {
        this.variablesGL.showDialog.next(true);
      }, 100);
    }
  
    deleteubicacion(ubicacion: UbicacionModel){
      Swal.fire({
        title: `Está seguro de eliminar la ubicacion ${ubicacion.direccion}?`,
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(ubicacion);
  
          this.UbicacionesService.eliminaUbicacion(ubicacion).subscribe(response => {
            if(response.exito){
                this.toastr.success(response.mensaje, 'Exito!!');
                this.getubicacions();
            }else{
                this.toastr.error(response.mensaje, 'Ups!!');
            }
          }, err => {
            console.log('error elimina ubicacion ', err);
            this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
          });
        } else if (result.isDenied) {
  
        }
      });
    }
  
    deleteSelectedubicacions(){
      Swal.fire({
        title: `Está seguro de eliminar las ${this.selectedubicaciones.length} ubicacions?`,
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
            this.selectedubicaciones.forEach(us => {
                this.UbicacionesService.eliminaUbicacion(us).subscribe();
            });
        } else if (result.isDenied) {
  
        }
      });
    }
  
  
  }
  