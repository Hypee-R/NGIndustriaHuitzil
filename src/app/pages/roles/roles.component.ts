import Swal from 'sweetalert2'
import { Component, OnInit } from '@angular/core';
import { RolModel } from 'src/app/models/rol.model';
import { VistaModel } from 'src/app/models/vista.model';
import { VistasRolesModel } from 'src/app/models/vistas-roles.model';
import { RolesService } from 'src/app/services/roles.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VistasService } from 'src/app/services/vistas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  statusPantalla: number;
  listRoles: RolModel[] = [];
  selectedRol: RolModel;
  selectedRolDialog: RolModel;
  listVistas: VistaModel[] = [];
  selectedVista: VistaModel;
  listVistasDisponibles: VistaModel[] = [];
  listVistasRol: VistasRolesModel[] = [];
  selectedViewRol: VistasRolesModel;
  loading: boolean = false;
  cols: any[] = [];
  rows: number = 0;
  accion = '';
  constructor(
    private toastr: ToastrService,
    private rolesService: RolesService,
    private vistasService: VistasService,
    private variablesService: VariablesService,
  ) {
    this.statusPantalla = this.variablesService.getStatusPantalla();
    this.cols = [
      { field: 'vista', header: 'Vista' },
    ];
    let status = variablesService.getPantalla();

    if(status == 'celular'){
      this.rows = 4;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 3;
    }else{
      this.rows = 7;
    }
  }

  ngOnInit(): void {
    this.getRoles();
    this.getVistas();
  }

  getRoles(){
    this.rolesService.getRoles().subscribe((response) => {
      if(response.exito){
          this.listRoles = response.respuesta;
      }
    });
  }

  getVistas(){
    this.vistasService.getVistas().subscribe((response) => {
      if(response.exito){
        this.listVistas = response.respuesta;
      }
    });
  }

  getVistasRol(rol: RolModel){
    this.vistasService.getVistasRoles(rol.idRol).subscribe(response => {
      if(response.exito){
        this.listVistasRol = response.respuesta;
        this.loading = false;
        this.setVistasDisponibles();
      }
    },err => {
      this.listVistasRol = [];
      this.loading = false;
      console.log('qwerty ', err);
    });
  }

  cargarVistasRol(rol: RolModel){
    this.selectedRol = rol;
    this.loading = true;
    this.getVistasRol(rol);
  }

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedRolDialog = new RolModel();
    setTimeout(() => {
      this.variablesService.showDialog.next(true);
    }, 100);
  }

  resetInfo(){
    this.getRoles();
    this.selectedRol = null;
    this.selectedVista = null;
  }

  editRol(rol: RolModel){
    this.accion = 'Actualizar';
    this.selectedRolDialog = {...rol};
    setTimeout(() => {
      this.variablesService.showDialog.next(true);
    }, 100);
  }

  deleteRol(rol: RolModel){
    Swal.fire({
      title: `Está seguro de eliminar el rol ${rol.descripcion}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolesService.eliminaRol(rol).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.resetInfo();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina rol ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

  openConfirmacion(){
    Swal.fire({
      title: `Agregar acceso a la vista ${this.selectedVista.nombre} al rol ${this.selectedRol.descripcion}?`,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        let newVistaRol = {
          IdVistaRol: 0,
          IdVista: this.selectedVista.idVista,
          IdRol: this.selectedRol.idRol
        };
        this.vistasService.agregaVistaRol(newVistaRol).subscribe(response => {
          if(response.exito){
            this.selectedRol = null;
            this.selectedVista = null;
            Swal.fire(response.mensaje, '', 'success');
          }
        });
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  deleteVistaRol(viewRol: VistasRolesModel){
    Swal.fire({
      title: `Eliminar acceso a la vista ${viewRol.vista} al rol ${this.selectedRol.descripcion}?`,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let newVistaRol = {
          IdVistaRol: viewRol.idVistaRol,
          IdVista: viewRol.idVista,
          IdRol: this.selectedRol.idRol
        };
        this.vistasService.eliminaVistaRol(newVistaRol).subscribe(response => {
          if(response.exito){
            this.selectedRol = null;
            this.selectedVista = null;
            Swal.fire(response.mensaje, '', 'success');
          }
        });
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  setVistasDisponibles(){
    this.listVistasDisponibles = [];
    this.listVistas.forEach(view => {
        let existeView = this.listVistasRol.find(x => x.idVista == view.idVista);
        if(!existeView){
            this.listVistasDisponibles.push(view);
        }
    });
  }

}
