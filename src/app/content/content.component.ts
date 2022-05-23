import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { flipInXAnimation } from '../shared/animations/flipinX';
import { fadeAnimation } from '../shared/animations/fade';
import { SlideAnimation } from '../shared/animations/slide';
import { VariablesService } from '../services/variablesGL.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [flipInXAnimation, fadeAnimation, SlideAnimation],
  providers: [MessageService],
})
export class ContentComponent implements OnInit, OnDestroy {
  userAuth: any;

  mostrarSideUser: boolean = false;
  contador: number = 0;

  sideUserSubscripcion: Subscription = new Subscription();
  userSubscripcion: Subscription = new Subscription();
  sideBarSubscripcion: Subscription = new Subscription();
  changeMenuSubscripcion: Subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private variablesGL: VariablesService,
  ) {
    // this.userSubcripcion = this.store.select('auth', 'user').subscribe((user: any) => {
    //   if (user && user.id)
    //     this.userAuth = user;
    // });

    this.userAuth = {
      nombre: 'Luis Antonio',
      apellidos: 'Altamirano Sánchez'
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
}
