import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatApartadoModel } from '../../../models/apartado.model';
import { ToastrService } from 'ngx-toastr';
import { VariablesService } from '../../../services/variablesGL.service';
import { InventarioService } from '../../../services/inventario.service';
import { TallasService } from '../../../services/tallas.service';
import { ApartadosService } from '../../../services/apartados.service';
import { PagoApartado } from 'src/app/models/pagoApartado';
import { productoModel } from '../../../models/productos.model';

@Component({
  selector: 'app-add-pago-pedido',
  templateUrl: './add-pago-pedido.component.html',
  styleUrls: ['./add-pago-pedido.component.css']
})
export class AddPagoPedidoComponent implements OnInit,OnChanges {

    //@Input() _accion: string;
    @Input() _listPagos : PagoApartado[]
    @Input() _apartado : CatApartadoModel
    @Input() _listArticulos: CatApartadoModel[]
    @Output() saveApartado: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    submitted = false;
    visibleDialog: boolean;
    accion = '';
    dialogSubscription: Subscription = new Subscription();
    rows = 10;
    listPagos: PagoApartado[] = [];
    cols: any[] = [];
    colsArticulos : any[]= []
    pagoApartado : PagoApartado = new PagoApartado()
    listArticulos:CatApartadoModel[] = []
    selectedTalla : number 
    totalAbonos : number
    hacerPago : boolean = true
    faltante : number = 0
    constructor(
      private toastr: ToastrService,
      private variablesGL: VariablesService,
      private inventarioService: InventarioService,
      private tallasService:TallasService,
      private apartadosService: ApartadosService
  
    ) {
      
      this.cols = [
        { field: 'idApartado', header: 'ID PAGO' },
        { field: 'sku', header: 'FECHA' },
        { field: 'descripcion', header: 'MONTO' },
      ];

      this.colsArticulos = [
        { field: 'descripcion', header: 'Articulo' },
        { field: 'talla', header: 'Talla' },
        { field : 'precio', header :'Precio'},
      ];

      this.pagoApartado = new PagoApartado()
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
    });
  
  }
  
  consultarAbonos(){
    this.totalAbonos = 0
    this.faltante = 0
    this.listPagos = this._listPagos

    this.listArticulos.forEach(articulo =>{
      this.faltante += articulo.precio
    })
    this._listPagos.forEach(pagos => {
      this.totalAbonos += pagos.cantidad
    });
    
    this.faltante -=this.totalAbonos
    if(this.totalAbonos >= this.faltante){
      this.hacerPago = false
    }
    else{
      this.hacerPago = true
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.listArticulos = this._listArticulos
    this.consultarAbonos()
   
  }
  ngOnInit(): void {
    this.listArticulos = this._listArticulos
    
    //console.log(this._apartado)
   this.consultarAbonos()
  }
  
  
  hideDialog() {
 
    }
    
  addPago(){
      this.submitted = true
      if(this.pagoApartado.cantidad <= this.faltante && this.pagoApartado.fecha != "")
      {
        this.pagoApartado.idApartado = this._apartado.idApartado
        this.apartadosService.agregaPago(this.pagoApartado).subscribe(response =>{
          if(response.exito){
            this.toastr.success('Abono realizado', 'Sucess');
            this.getPagos()
            setTimeout(() => {
              
            }, 200);
          }
          else{
            this.toastr.success(response.mensaje, 'Error!');
          }
      })
      }
    }
  
  getPagos(){
      this.listPagos = []
      console.log(this._apartado.idApartado)
      this.apartadosService.getPagoByApartado(this._apartado.idApartado).subscribe(response =>{
          if(response.exito){
            this.listPagos = response.respuesta
            //this.consultarAbonos()
            this.faltante = 0 
            this.totalAbonos = 0
            this.listPagos.forEach(pagos => {
              this.totalAbonos += pagos.cantidad
            });
            this.listArticulos.forEach(articulo =>{
              this.faltante += articulo.precio
            })
            if(this.totalAbonos >= this.faltante){
              this.hacerPago = false
            }
            else{
              this.hacerPago = true
            }
            this.faltante  -= this.totalAbonos
          }
      }
      )
    }

}
