import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { SolicitudesMaterialModel } from '../../models/solicitudes.model';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  rows = 0;
  accion = '';
  cols: any[] = [];
  statusPantalla: number;
  loading: boolean = false;
  selectedSolicitud: SolicitudesMaterialModel = new SolicitudesMaterialModel();
  selectedSolicitudes: SolicitudesMaterialModel[];
  listSolicitudes: SolicitudesMaterialModel[] = [];
  constructor(
    public variablesGL: VariablesService,
    private solicitudesService: SolicitudesService,
    private toastr: ToastrService,
  ) {
    this.cols = [
      { field: 'proveedorMaterial.material.nombre', header: 'Material' },
      { field: 'proveedorMaterial.proveedor.nombre', header: 'Proveedor' },
      { field: 'fecha', header: 'Fecha Solicitud' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'proveedorMaterial.material.precio', header: 'Precio Unitario' },
      { field: 'costoTotal', header: 'Costo Total' },
      { field: 'status', header: 'Status' },
      { field: 'fechaUpdate', header: 'Fecha Actualización' },
      { field: 'usuario.usuario', header: 'Registrado Por' },
      { field: 'comentarios', header: 'Comentarios' },
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
    this.getSolicitudes();
  }

  getSolicitudes(){
      this.loading = true;
      this.solicitudesService.getSolicitudes().subscribe(response => {
        if(response.exito){
          // console.log(response.respuesta);
          this.listSolicitudes = response.respuesta;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedSolicitud = new SolicitudesMaterialModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  editSolicitud(solicitud: SolicitudesMaterialModel){
    this.accion = 'Actualizar';
    this.selectedSolicitud = {...solicitud};
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  deleteSolicitud(solicitud: SolicitudesMaterialModel){
    Swal.fire({
      title: `¿Desea eliminar la solicitud material -> '${solicitud.proveedorMaterial.material.nombre}'?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Si, Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(solicitud);
        solicitud.usuario = null;
        solicitud.proveedorMaterial = null;
        this.solicitudesService.eliminaSolicitud(solicitud).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.getSolicitudes();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina solicitud material ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

  deleteSelectedSolicitud(){
    Swal.fire({
      title: `Está seguro de eliminar las ${this.selectedSolicitudes.length} solicitudes de materiales?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
          this.selectedSolicitudes.forEach(us => {
              this.solicitudesService.eliminaSolicitud(us).subscribe();
          });
      } else if (result.isDenied) {

      }
    });
  }

}
