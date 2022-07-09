import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variablesGL.service';
import { UsuarioModel } from '../../models/usuarios.model';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuarioAuthModel } from 'src/app/models/usuario-auth.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  rows = 0;
  accion = '';
  cols: any[] = [];
  statusPantalla: number;
  loading: boolean = false;
  selectedUsuario: UsuarioModel = new UsuarioModel();
  selectedUsuarios: UsuarioModel[];
  listUsuarios: UsuarioModel[] = [];

  constructor(
    public variablesGL: VariablesService,
    private usuariosService: UsuariosService,
    private toastr: ToastrService,
  ) {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellidoPaterno', header: 'Apellido Paterno' },
      { field: 'apellidoMaterno', header: 'Apellido Materno' },
      { field: 'usuario', header: 'Usuario' },
      { field: 'rol', header: 'Rol' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'correo', header: 'Correo' }
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

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(){
      this.loading = true;
      let userLogged: UsuarioAuthModel = JSON.parse(localStorage.getItem('usuario'));
      this.usuariosService.getUsuarios().subscribe(response => {
        if(response.exito){
          this.listUsuarios = response.respuesta;
          let userLoggedIndex = this.listUsuarios.findIndex(x => x.idUser == userLogged.id);
          this.listUsuarios.splice(userLoggedIndex, 1);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedUsuario = new UsuarioModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  editUsuario(usuario: UsuarioModel){
    this.accion = 'Actualizar';
    this.selectedUsuario = {...usuario};
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  deleteUsuario(usuario: UsuarioModel){
    Swal.fire({
      title: `Está seguro de eliminar el usuario ${usuario.nombre}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(usuario);

        this.usuariosService.eliminaUsuario(usuario).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.getUsuarios();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina usuario ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

  deleteSelectedUsuarios(){
    Swal.fire({
      title: `Está seguro de eliminar los ${this.selectedUsuarios.length} usuarios?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
          this.selectedUsuarios.forEach(us => {
              this.usuariosService.eliminaUsuario(us).subscribe();
          });
      } else if (result.isDenied) {

      }
    });
  }

}
