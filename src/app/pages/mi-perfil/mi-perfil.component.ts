import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  user: any;
  submitted: boolean;
  statusPantalla: number;
  formContrasena: FormGroup;
  constructor(
    private fb: FormBuilder,
    private variablesService: VariablesService
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
      repetirPassword: ['' ],
    },{validator: this.variablesService.checkPassword})
  }

  async updatePassword(){
    this.submitted = true;
      if(this.formContrasena.valid){

      }
  }

}
