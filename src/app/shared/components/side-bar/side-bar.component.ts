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
        this.menu.push({ title: vistaMenu.nombre, icon: this.getIconMenu(vistaMenu.nombre), url: vistaMenu.routerLink });
    });
    console.log('build menu success!!');

    // this.menu.push({ title: 'Dashboard', icon: 'fa-solid fa-chart-line', url: '/dashboard' });
    // this.menu.push({ title: 'Inventario', icon: 'fa-solid fa-boxes-stacked', url: '/inventory' });
    // this.menu.push({ title: 'Compras', icon: 'fa-solid fa-cart-shopping', url: '/shopping' });
    // this.menu.push({ title: 'Ventas', icon: 'fa-solid fa-store', url: '/sales' });
    // this.menu.push({ title: 'Solicitudes', icon: 'fa-solid fa-file-import', url: '/request' });
    // this.menu.push({ title: 'Informes', icon: 'fa-solid fa-file-invoice', url: '/reports' });
    // this.menu.push({ title: 'Ubicaciones', icon: 'fa-solid fa-location-dot', url: '/locations' });
    // this.menu.push({ title: 'Categorias', icon: 'fa-solid fa-rectangle-list', url: '/categories' });
    // this.menu.push({ title: 'Proveedores', icon: 'fa-solid fa-users', url: '/providers' });
    // this.menu.push({ title: 'Tallas', icon: 'fa-solid fa-shirt', url: '/sizes' });
    // this.menu.push({ title: 'Mi Perfil', icon: 'fa-solid fa-user-gear', url: '/my-profile' });
    // this.menu.push({ title: 'Usuarios', icon: 'fa-solid fa-user-group', url: '/users' });
    // this.menu.push({ title: 'Roles', icon: 'fa-solid fa-id-badge', url: '/roles' });
  }

  getIconMenu(vista: string){
    switch(vista){
      case 'Dashboard': return 'fa-solid fa-chart-line';
      case 'Inventario': return 'fa-solid fa-boxes-stacked';
      case 'Compras': return 'fa-solid fa-cart-shopping'
      case 'Ventas': return 'fa-solid fa-store';
      case 'Solicitudes': return 'fa-solid fa-file-import';
      case 'Informes': return 'fa-solid fa-file-invoice';
      case 'Ubicaciones': return 'fa-solid fa-location-dot';
      case 'Categorias': return 'fa-solid fa-rectangle-list';
      case 'Proveedores': return 'fa-solid fa-users';
      case 'Tallas': return 'fa-solid fa-shirt';
      case 'Mi Perfil': return 'fa-solid fa-user-gear';
      case 'Usuarios': return 'fa-solid fa-user-group';
      default: return 'fa-solid fa-id-badge';
    }
  }

}
