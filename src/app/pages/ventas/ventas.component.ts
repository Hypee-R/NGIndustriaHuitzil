import { Component, OnInit,Injectable } from '@angular/core';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VariablesService } from 'src/app/services/variablesGL.service';

export interface Car {
  vin;
  year;
  brand;
  color;
}



class ventaModel{
  idProducto: string;
  cantidad:number;
  caja:string;
  totalParcial:number;
  constructor(){
      this.idProducto = "";
      this.cantidad=0;
      this.caja=""
      this.totalParcial=0

    }
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})




export class VentasComponent implements OnInit {
  cars: Car[];
  statusPanubicacion: number;
  loading: boolean = false;
  listVentas: ventaModel[] = [];
  cols: any[] = [];
  rows = 0;
  value18=21
  value8: any;
  cities: any[];
  constructor(
    public variablesGL: VariablesService,
    
  ) { 

    this.cols = [
      { field: 'idProducto', header: 'Producto' },
      { field: 'cantidad',header:'cantidad'},
      // { field: 'totalParcial', header: 'totalParcial' },
      // { field: 'caja', header: 'caja' },
      //{ field: 'apellidoPEncargado', header: 'apellidoPEncargado' },
      //{ field: 'apellidoMEncargado', header: 'apellidoMEncargado' },
      //{ field: 'telefono1', header: 'telefono1' },
     // { field: 'telefono2', header: 'telefono2' },
      //{ field: 'correo', header: 'correo' },
    ];

    this.cities = [
      { name: "New York", code: "NY" },
      { name: "Rome", code: "RM" },
      { name: "London", code: "LDN" },
      { name: "Istanbul", code: "IST" },
      { name: "Paris", code: "PRS" }
    ];

    this.statusPanubicacion = this.variablesGL.getStatusPantalla();
      let status = this.variablesGL.getPantalla();
      if(status == 'celular'){
        this.rows = 6;
      }else if(status == 'tablet'){
        this.rows = 7;
      }else if(status == 'laptop'){
        this.rows = 5;
      }else{
        this.rows = 11;
      }

  }

  ngOnInit(): void {
    this.loading=false
    let venta:ventaModel={idProducto:"Demo1 (Talla 25 ) \n15226 DEMO1",totalParcial:100,caja:"caja1",cantidad:100}
    this.listVentas.push(venta)
    this.listVentas.push(venta)

    this.listVentas.push(venta)

  

    //this.listVentas=[venta,venta]
  }

}
