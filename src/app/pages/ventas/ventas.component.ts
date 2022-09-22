import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { productoModel } from 'src/app/models/productos.model';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { InventarioService } from 'src/app/services/inventario.service';
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
  queryString: string = '';
  listVentas: ventaModel[] = [];
  lstProducts: productoModel[] = [];
  cols: any[] = [];
  colsProducts:any[] = [];
  rows = 0;
  value18=21
  value8: any;
  cities: any[];
  accion = '';

  ///Modificar
  //listTallas: CatTallaModel[] = [];
  
  selectedTalla: CatTallaModel = new CatTallaModel();
  selectedTallas: CatTallaModel[];
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService
  ) {

    this.cols = [
      { field: 'idProducto', header: 'Producto' },
      { field: 'cantidad',header:'cantidad'},
    ];

    this.colsProducts = [
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion',header:'PRODUCTO'},
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

  getResults(){
    if(this.queryString && this.queryString.trim().length > 0){
      this.variablesGL.showLoading();
      this.inventarioService.searchProduct(this.queryString).subscribe(response => {
        if(response.exito){
          this.variablesGL.hideLoading();
          
          this.toastr.success(response.mensaje, 'Exito!!!');
          this.lstProducts = response.respuesta;
          console.log('resultados de la busqueda: ', this.lstProducts);
        }else{
          this.variablesGL.hideLoading();
          this.toastr.error(response.mensaje, 'Error!');
        }
      }, err => {
        this.variablesGL.hideLoading();
        this.toastr.error('Hubo un error al buscar los productos', 'Error!');
      });
    }else{
      this.toastr.error('Ingrese un elemento de busqueda', 'Atención!');
    }
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
