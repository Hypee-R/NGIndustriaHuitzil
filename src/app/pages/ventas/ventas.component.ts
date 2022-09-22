import { Component, OnInit,Injectable } from '@angular/core';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VariablesService } from 'src/app/services/variablesGL.service';




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
 
  statusPanubicacion: number;
  loading: boolean = false;
  listVentas: ventaModel[] = [];
  cols: any[] = [];
  rows = 0;
  value18=21
  value8: any;
  cities: any[];
  accion = '';

  ///Modificar
  listTallas: CatTallaModel[] = [];
  selectedTalla: CatTallaModel = new CatTallaModel();
  selectedTallas: CatTallaModel[];
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

  openCashRegister(){
    this.accion = 'Abrir';
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  closeCashRegister(){
    this.accion = 'Cerrar';
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  statusRegistrer(){
    this.accion = 'Cerrar';
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }
}
