import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';
import { productoModel } from 'src/app/models/productos.model';

import { InventarioService } from 'src/app/services/inventario.service';

export interface imagen64 {
  id: number,
  imagen64c: string
}
@Component({
  selector: 'app-contro-envios',
  templateUrl: './contro-envios.component.html',
  styleUrls: ['./contro-envios.component.css']
})
export class ControEnviosComponent implements OnInit {
  statusPantalla: number
  listArticulos: productoModel[] ;
  loading: boolean = false;
  imagenes: imagen64[] = []

  list2: productoModel[];

  
  constructor( private primengConfig: PrimeNGConfig,
    private inventarioService: InventarioService) { }

  ngOnInit(): void {
    this.getArticulos();
    // this.list1 = //initialize list 1
       this.list2 = [];//initialize list 2
  }

  getArticulos() {
    this.loading = true;
    this.inventarioService.getArticulos().subscribe(response => {
      if (response.exito) {
        this.listArticulos = response.respuesta;
        this.loading = false;
        for (let art of this.listArticulos) {
          this.imagenes.push({ id: art.idArticulo, imagen64c: art.imagen })
        }
      }
    }, err => {
      this.loading = false;
    });
  }

}
