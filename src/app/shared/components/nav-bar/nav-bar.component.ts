import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeAnimation } from 'src/app/shared/animations/fade';
import { VariablesService } from '../../../services/variablesGL.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  animations: [fadeAnimation]
})
export class NavBarComponent implements OnInit, OnDestroy {
  mostrarSideUser: boolean = false;
  user:any;
  dark: boolean = false;
  toggle: boolean = false;
  pantalla: number;

  sideUserSubcripcion: Subscription = new Subscription();
  constructor(
    private variablesGL: VariablesService
  ) {
    this.pantalla = variablesGL.getStatusPantalla();
    this.sideUserSubcripcion = this.variablesGL.showSideUser.subscribe(value => this.mostrarSideUser = value );
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
    this.setTheme();
  }

  ngOnDestroy(): void {
      if(this.sideUserSubcripcion){
        this.sideUserSubcripcion.unsubscribe();
      }
  }

  //change Theme
  changeTheme(){
    const themeToggler = document.querySelector(".theme-toggler");
    this.dark = !this.dark;
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('i:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('i:nth-child(2)').classList.toggle('active');
    this.variablesGL.changeTheme(this.dark);
  }

  setTheme(){
    const themeToggler = document.querySelector(".theme-toggler");
    this.dark = JSON.parse(localStorage.getItem('darkTheme'));
    if(this.dark){
      document.body.classList.toggle('dark-theme-variables');
      themeToggler.querySelector('i:nth-child(1)').classList.remove('active');
      themeToggler.querySelector('i:nth-child(2)').classList.add('active');
    }
  }

  toggleMenu(){
    const menuToggle = document.querySelector('#toggle-menu');
    menuToggle.classList.toggle('active');
    this.toggle = !this.toggle;
    this.variablesGL.changeTipoMenu.next(this.toggle);
  }

  toggleMenuMovil(){
    this.toggle = !this.toggle;
    this.variablesGL.showSideBar.next(this.toggle);
  }

  showSideUser(){
    this.variablesGL.showSideUser.next(true);
  }

}
