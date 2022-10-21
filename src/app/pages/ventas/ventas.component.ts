import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CajaModel } from 'src/app/models/caja.model';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';

export interface Car {
  vin;
  year;
  brand;
  color;
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
  queryStringClient: string = '';
  listVentas: productoModel[] = [];
  lstProducts: productoModel[] = [];
  cols: any[] = [];
  colsProducts:any[] = [];
  rows = 0;
  accion = '';
  articulos=0
  total = 0
  clienteName  : string = '';
  cantidades:number[]=[]

  cashModel: CajaModel;

  constructor(
    private toastr: ToastrService,
    private ventasService: VentasService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private proveedoresService: ProveedoresService,

  ) {

    this.cols = [
      { field: 'descripcion', header: 'Producto' },
      { field: 'precio',header:'Precio'},
      { field: 'talla',header:'Talla'},

    ];

    this.colsProducts = [
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion',header:'Producto'},
      { field: 'talla',header: 'Talla'}
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

  selectedValues: string[] = [];

  ngOnInit(): void {
    this.loading=false

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
  getResultsClients(){
    if(this.queryStringClient && this.queryStringClient.trim().length > 0){
      this.variablesGL.showLoading();
      this.proveedoresService.searchCliente(this.queryStringClient).subscribe(response => {
        if(response.exito){
          this.variablesGL.hideLoading();

          this.toastr.success(response.mensaje, 'Exito!!!');
          this.clienteName = response.respuesta[0].nombre;
          console.log('resultados de la busqueda: ', this.clienteName);
        }else{
          this.variablesGL.hideLoading();
          this.clienteName = '';
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
    this.getCaja();
  }

  closeCashRegister(){
    this.accion = 'Cerrar';
    this.getCaja();
  }

  statusCashRegister(){
    this.accion = 'Status';
    this.getCaja();
  }

  addProduct(product: productoModel){
    this.listVentas.push(product)
    this.articulos+=1
    this.total+=product.precio
    this.cantidades.push(1)
    // console.log(this.listVentas.indexOf(product))

  }

  deleteProduct(product:productoModel,index:number){

    this.cantidades[index]-=1
    this.total -= this.listVentas[index].precio
    this.articulos-=1
    if(this.cantidades[index]<1){
      this.cantidades.splice(index,1)
      this.listVentas.splice(this.listVentas.indexOf(product),1)
      this.articulos=this.listVentas.length}
  }

  addProductVenta(index :number){
    this.articulos+=1
    this.cantidades[index]+=1
    this.total += this.listVentas[index].precio

  }
  cancelarCompra(){
    this.articulos=0
    this.total=0
    this.cantidades=[]
    this.listVentas=[]
  }

  getCaja(){
      this.ventasService.getCaja().subscribe(resp => {
        console.log('data vcaja ', resp);
        if(resp.exito){
          this.cashModel = resp.respuesta;


          if(this.cashModel.fecha != null && this.cashModel.fechaCierre == null){
              if(this.accion == 'Abrir'){
                console.log('No se puede abrir caja, hay una abierta...');
                this.toastr.info('Actualmente hay una caja abierta', 'Atención!');
                return;
              }
              // else if(this.accion == 'Cerrar'){
              //   console.log('No hay una caja abierta para cerrar');
              //   this.toastr.info('No hay caja abierta para cerrar', 'Atención!');
              //   return;
              // }
          }else if(this.cashModel.fecha != null && this.cashModel.fechaCierre != null){
              if(this.accion == 'Abrir'){
                console.log('Abrir caja...');
                this.cashModel = new CajaModel();
              }else if(this.accion == 'Cerrar'){
                console.log('ya está cerrada la caja');
                this.toastr.info('Ya está cerrada la caja', 'Atención!');
                this.accion = 'Status';
              }
          }

          // if(this.accion == 'Abrir' && this.cashModel.fecha != null && this.cashModel.fechaCierre != null){
          //     console.log('Abrir caja...');
          //     this.cashModel = new CajaModel();
          // }else if(this.accion == 'Abrir' && this.cashModel.fecha != null && this.cashModel.fechaCierre == null){
          //   console.log('No se puede abrir caja, hay una abierta...');
          //   this.toastr.info('Actualmente hay una caja abierta', 'Atención!');
          //   return;
          // }

          // // if(this.accion == 'Cerrar' && this.cashModel.fechaCierre == null){
          // //     console.log('Cerrar caja...');
          // // }else
          // if(this.accion == 'Cerrar' && this.cashModel.fecha != null && this.cashModel.fechaCierre == null){
          //     console.log('No hay una caja abierta para cerrar');
          //     this.toastr.info('No hay caja abierta para cerrar', 'Atención!');
          //     return;
          // }else if(this.accion == 'Cerrar' && this.cashModel.fecha != null && this.cashModel.fechaCierre != null){
          //     console.log('ya está cerrada la caja');
          //     this.toastr.info('Ya está cerrada la caja', 'Atención!');
          //     this.accion = 'Status';
          //     // return;
          // }

          setTimeout(() => {
            this.variablesGL.showDialog.next(true);
          }, 100);


        }else{

          if(this.accion == 'Abrir'){
            this.cashModel = new CajaModel();
            setTimeout(() => {
              this.variablesGL.showDialog.next(true);
            }, 100);
          }else{
            this.toastr.info(resp.mensaje, 'Atención!');
          }

        }
      },
      err => {
        this.toastr.error('Error al obtener status de la caja', 'Error!');
        this.cashModel = new CajaModel();
      });
  }
}
