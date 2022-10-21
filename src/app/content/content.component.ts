import Swal from 'sweetalert2';
import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { flipInXAnimation } from '../shared/animations/flipinX';
import { fadeAnimation } from '../shared/animations/fade';
import { SlideAnimation } from '../shared/animations/slide';
import { VariablesService } from '../services/variablesGL.service';
import { UbicacionesService } from '../services/ubicaciones.service';
import { UsuarioAuthModel } from '../models/usuario-auth.model';
import { UbicacionModel } from '../models/ubicacion.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [flipInXAnimation, fadeAnimation, SlideAnimation],
  providers: [MessageService],
})
export class ContentComponent implements OnInit, OnDestroy {
  userAuth: UsuarioAuthModel;

  contador: number = 0;
  lstUbicaciones: UbicacionModel[] = [];
  mostrarSideUser: boolean = false;

  sideUserSubscripcion: Subscription = new Subscription();
  userSubscripcion: Subscription = new Subscription();
  sideBarSubscripcion: Subscription = new Subscription();
  changeMenuSubscripcion: Subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private variablesGL: VariablesService,
    private ubicacionesService: UbicacionesService,
  ) {

    this.userAuth = JSON.parse(localStorage.getItem('usuario'));

    //Selecciona sucursal perfil vendedor
    if(this.userAuth.rol == 'Vendedor'){
        let sucursal = variablesGL.getSucursal();
        if(!sucursal){
          this.getSucursales();
        }else{
          console.log('Ya selecciono sucursal... ->',sucursal);
        }
    }

    // Tipo de menu en pantalla (Laptop +)
    this.changeMenuSubscripcion = this.variablesGL.changeTipoMenu.subscribe((tipo: boolean) => {
      let contenidoOutled = document.querySelector('#Contenido');
      let tipoPantalla = variablesGL.getStatusPantalla();
      if(tipoPantalla > 10){
        if (contenidoOutled) {
          if (tipo){
            contenidoOutled.classList.toggle('contenido-chico');
            contenidoOutled.classList.toggle('contenidoNormal');
          }else{
            contenidoOutled.classList.toggle('contenidoNormal');
            contenidoOutled.classList.toggle('contenido-chico');
          }
        }
      }
    });

    //Movil
    this.sideBarSubscripcion = this.variablesGL.showSideBar.subscribe(stateSide => {
      let sideBar:any = document.querySelector("#menu");
      if (sideBar) {
        if (stateSide){
          sideBar.style.display = 'block';
        }else{
          sideBar.style.display = 'none';
        }
      }
    });

    // Side User
    this.sideUserSubscripcion = this.variablesGL.showSideUser.subscribe(value => {
      this.mostrarSideUser = value;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sideUserSubscripcion) {
      this.sideUserSubscripcion.unsubscribe();
    }
    if (this.userSubscripcion) {
      this.userSubscripcion.unsubscribe();
    }
    if (this.changeMenuSubscripcion) {
      this.changeMenuSubscripcion.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  clickSides($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener('document:click', ['$event']) clickedOutside($event) {
    if (this.mostrarSideUser && this.contador == 0) {
      this.mostrarSideUser = true;
      this.contador++;
    }
    else if (this.mostrarSideUser && this.contador == 1) {
      this.emptySides();
    }
  }

  emptySides() {
    this.mostrarSideUser = false;
    this.contador = 0;
    this.variablesGL.showSideUser.next(false);
  }

  getSucursales(){
      this.ubicacionesService.getUbicaciones().subscribe(response => {
        if(response.exito){
          this.lstUbicaciones = response.respuesta;
          this.selectSucursal();
        }
      });
  }

  selectSucursal(){
     Swal.fire({
      title: 'Vendedor',
      input: "select",
      text: "Selecciona una sucursal",
      icon: "warning",
      allowEscapeKey: false,
      allowOutsideClick: false,
      inputOptions: this.lstUbicaciones.map(ubicacion => ubicacion.direccion),
      inputPlaceholder: 'Selecciona...',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if(value){
            resolve('')
          }else{
            resolve('Selecciona una opcion')
          }
        })
      },
      showCancelButton: false,
      showConfirmButton: true,
     }).then(respuesta => {
        let sucursalSelected = this.lstUbicaciones[respuesta.value];
        console.log('option selected? -> ', sucursalSelected.direccion);
        this.variablesGL.setSucursal(sucursalSelected.direccion);

     })
  }
}
