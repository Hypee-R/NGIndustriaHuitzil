import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UsuarioModel } from '../../../models/usuarios.model';
import { VariablesService } from '../../../services/variablesGL.service';
import { Subscription } from 'rxjs';
import { RolModel } from '../../../models/rol.model';
import { RolesService } from 'src/app/services/roles.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit, OnDestroy {
  @Input() _accion: string;
  @Input() _editUsuario: UsuarioModel;
  @Output() saveUser: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  listRoles: RolModel = new RolModel();
  usuario: UsuarioModel = new UsuarioModel();
  pattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private rolesService: RolesService,
    private variablesGL: VariablesService,
    private usuariosService: UsuariosService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editUsuario){
          this.usuario = this._editUsuario;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.usuario = this._editUsuario;
    this.getRoles();
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  getRoles(){
      this.rolesService.getRoles().subscribe(response => {
        if(response.exito){
          this.listRoles = response.respuesta;
        }
      });
  }

  hideDialog() {
    this.submitted = false;
    this.usuario = new UsuarioModel();
    this.variablesGL.showDialog.next(false);
  }

  saveUsuario(){
    this.submitted = true;
    if(this.usuario.nombre?.length > 2 && this.usuario.apellidoPaterno?.length > 2 && this.usuario.apellidoMaterno?.length > 2
      && this.usuario.usuario?.length > 3 && this.usuario.telefono?.length == 10 && this.usuario.correo.match(this.pattern) && this.usuario.idRol){
      console.log('datos validos!!');

      this.usuario.rol = "asasdasd";
      this.usuario.password = this.variablesGL.getSHA1('123456789');
      console.log('data usuario ', this.usuario);

      if(this._accion == 'Agregar'){
        this.guardarUsuario();
      }else{
        this.actualizarUsuario();
      }

    }
  }

  guardarUsuario(){
    this.usuariosService.agregaUsuario(this.usuario).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveUser.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add usuario ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarUsuario(){
    this.usuariosService.actualizaUsuario(this.usuario).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveUser.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza usuario ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

}
