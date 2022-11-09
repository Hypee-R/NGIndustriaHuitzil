import Swal from 'sweetalert2'
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { UsuarioAuthModel } from '../../models/usuario-auth.model';
import { VariablesService } from '../../services/variablesGL.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private variablesGL: VariablesService,
  ) { }

  ngOnInit(): void {
  }

  iniciarSesion(email: string, password: string){
    if(email != "" && email.length > 0 && password != "" && password.length > 0){
        const credenciales = {
          "usuario": email,
          "contrasena": this.variablesGL.getSHA1(password)
        };
        // console.log('request ', credenciales);
        // localStorage.d = "respuesta.respuesta.token";
        // this.router.navigate(["/home"]);
        Swal.fire({
            title: 'Por favor espera...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading(null);
            }
        });
        this.authService.login(credenciales).subscribe( (respuesta: any) => {
          console.log('respuesta login ', respuesta);
          Swal.close();
          if(respuesta.exito){
              const dataLogin: UsuarioAuthModel = respuesta.respuesta;
              localStorage.setItem('usuario', JSON.stringify(dataLogin));
              localStorage.d = respuesta.respuesta.token;
              this.router.navigate([dataLogin?.vistas[0]?.routerLink ?? '/dashboard']);
              this.toastr.success(respuesta.mensaje,'Acceso Correcto');
          }else{
              this.toastr.error(respuesta.mensaje, 'Acceso Incorrecto');
          }
        },
        err => {
            Swal.close();
            this.toastr.error('Hubo un problema al conectar con los servicios en linea','Acceso Incorrecto');
        });
    }else{
        this.toastr.info('Por favor ingrese un usuario y contraseña validos!', 'Atencion!');
    }
  }

}
