import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RolModel } from 'src/app/models/rol.model';
import { RolesService } from 'src/app/services/roles.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-add-rol',
  templateUrl: './add-rol.component.html',
  styleUrls: ['./add-rol.component.css']
})
export class AddRolComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editRol: RolModel;
  @Output() saveRol: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  rol: RolModel = new RolModel();

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private rolesService: RolesService,
    private variablesGL: VariablesService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editRol){
          this.rol= this._editRol;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.rol = this._editRol;
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  hideDialog() {
    this.submitted = false;
    this.rol = new RolModel();
    this.variablesGL.showDialog.next(false);
  }

  saveDataRol(){
    this.submitted = true;
    if(this.rol.descripcion?.length > 2){
      console.log('datos validos!!');
      console.log('data rol ', this.rol);

      if(this._accion == 'Agregar'){
        this.guardarRol();
      }else{
        this.actualizarRol();
      }
    }
  }

  guardarRol(){
    this.rolesService.agregaRol(this.rol).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveRol.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add rol ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarRol(){
    this.rolesService.actualizaRol(this.rol).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveRol.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza rol ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

}
