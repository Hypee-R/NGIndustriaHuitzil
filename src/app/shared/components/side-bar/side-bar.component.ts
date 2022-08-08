import { Component, OnInit, OnDestroy } from '@angular/core';
import { VariablesService } from '../../../services/variablesGL.service';
import { Subscription } from 'rxjs';
import { Menu } from '../../models/menu.model';
import { UsuarioAuthModel } from '../../../models/usuario-auth.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {
  tipoPantalla: number;

  sideBarSuscription: Subscription = new Subscription();
  changeMenuSubcripcion: Subscription = new Subscription();
  menu: Menu[] = [];
  user: UsuarioAuthModel;
  constructor(
    private variablesGL: VariablesService
  ) {
    //Movil
    this.sideBarSuscription = this.variablesGL.showSideBar.subscribe(stateSide => {
      let sideBar:any = document.querySelector("#sidebar");
      if (sideBar) {
        if (stateSide){
          sideBar.style.display = 'block';
        }else{
          sideBar.style.display = 'none';
        }
      }
    });

    // Tipo de menu en pantalla (Laptop +)
    this.changeMenuSubcripcion = this.variablesGL.changeTipoMenu.subscribe((tipo: boolean) => {
      let sideBar:any = document.querySelector("#sidebar");
      this.tipoPantalla = variablesGL.getStatusPantalla();
      if(this.tipoPantalla > 10){

        if(sideBar){
          if(tipo){
            sideBar.classList.toggle('active');
          }else{
            sideBar.classList.toggle('active');
          }
        }
      }
    });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
    this.buildMenu();
  }

  ngOnDestroy(): void {
    if(this.sideBarSuscription){
      this.sideBarSuscription.unsubscribe();
    }
    if(this.changeMenuSubcripcion){
      this.changeMenuSubcripcion.unsubscribe();
    }
  }

  toggleMenu(){
      this.variablesGL.showSideBar.next(false);
  }

  buildMenu(){
    this.user.vistas.forEach(vistaMenu => {
        this.menu.push({ title: vistaMenu.nombre, icon: vistaMenu.icon, url: vistaMenu.routerLink });
    });
  }

}
