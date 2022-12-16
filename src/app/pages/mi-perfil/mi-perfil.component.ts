import Swal from 'sweetalert2'
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioAuthModel } from 'src/app/models/usuario-auth.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  user: UsuarioAuthModel;
  submitted: boolean;
  validPswAct: boolean;
  statusPantalla: number;
  formContrasena: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private usuariosService: UsuariosService,
    private variablesService: VariablesService,
  ) {
    this.statusPantalla = this.variablesService.getStatusPantalla();
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('usuario'));
    this.initForm();
  }

  initForm(){
    this.formContrasena = this.fb.group({
      contrasenaActual: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: [''],
    },{validator: this.variablesService.checkPassword});
    this.validateActualPsw();
    this.formContrasena.get('password').disable();
    this.formContrasena.get('repetirPassword').disable();
  }

  validateActualPsw(){
    this.formContrasena.get('contrasenaActual').valueChanges.subscribe((data: string) => {
      let encriptPsw = this.variablesService.getSHA1(data);
      if(encriptPsw.toUpperCase() == this.user.password.toUpperCase()){
        this.validPswAct = true;
        this.formContrasena.get('contrasenaActual').disable();
        this.formContrasena.get('password').enable();
        this.formContrasena.get('repetirPassword').enable();
      }else{
        this.validPswAct = false;
        this.formContrasena.get('password').disable();
        this.formContrasena.get('repetirPassword').disable();
      }
    });
  }

  async updatePassword(){
    this.submitted = true;
    // console.log(this.formContrasena);
    if(this.formContrasena.valid){
        this.usuariosService.updatePassword(this.user.id, this.variablesService.getSHA1(this.formContrasena.get('password').value))
        .subscribe(response => {
            if(response.exito){
              // this.toastr.success(response.mensaje, 'Exito!');
              Swal.fire({
                title: response.mensaje,
                text: 'Debes volver a iniciar sesión!',
                icon: 'success',
                allowEscapeKey: false,
                allowOutsideClick: false,
              }).then((result) => {
                this.variablesService.removeCredential();
              });

            }else{
              this.toastr.warning(response.mensaje, 'Atención!');
            }
            this.submitted = false;
            this.formContrasena.reset();
        },
        err => {
          this.toastr.error(err, 'Error!');
          this.submitted = false;
          this.formContrasena.reset();
        });
    }
  }

}
