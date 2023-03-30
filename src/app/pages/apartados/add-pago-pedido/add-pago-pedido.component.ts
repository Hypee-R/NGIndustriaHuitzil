import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatApartadoModel } from '../../../models/apartado.model';
import { ToastrService } from 'ngx-toastr';
import { VariablesService } from '../../../services/variablesGL.service';
import { InventarioService } from '../../../services/inventario.service';
import { TallasService } from '../../../services/tallas.service';
import { ApartadosService } from '../../../services/apartados.service';
import { PagoApartado } from 'src/app/models/pagoApartado';

@Component({
  selector: 'app-add-pago-pedido',
  templateUrl: './add-pago-pedido.component.html',
  styleUrls: ['./add-pago-pedido.component.css']
})
export class AddPagoPedidoComponent implements OnInit,OnChanges {

    //@Input() _accion: string;
    @Input() _listPagos : PagoApartado[]
    @Input() _apartado : CatApartadoModel;
    @Output() saveApartado: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    submitted = false;
    visibleDialog: boolean;
    accion = '';
    dialogSubscription: Subscription = new Subscription();
    rows = 10;
    listPagos: PagoApartado[] = [];
    cols: any[] = [];
    pagoApartado : PagoApartado = new PagoApartado()
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
      this.totalAbonos = 0
      this.listPagos = this._listPagos
      this.cols = [
        { field: 'idApartado', header: 'ID PAGO' },
        { field: 'sku', header: 'FECHA' },
        { field: 'descripcion', header: 'MONTO' },
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
    this._listPagos.forEach(pagos => {
      this.totalAbonos += pagos.cantidad
    });
    
    if(this.totalAbonos >= this._apartado.precio){
      this.hacerPago = false
    }
    else{
      this.hacerPago = true
    }
    this.faltante = this._apartado.precio - this.totalAbonos
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.consultarAbonos()
   
  }
  ngOnInit(): void {
   this.consultarAbonos()
  }
  
  
  hideDialog() {
      /*this.listPagos = []
      this.submitted = false;
      this.pagoApartado = new PagoApartado()
      this.ngOnDestroy*/
    }
    
  addPago(){
      this.submitted = true
      if(this.pagoApartado.cantidad < this._apartado.precio && this.pagoApartado.fecha != "")
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
    }}
  
  getPagos(){
      this.listPagos = []
      console.log(this._apartado.idApartado)
      this.apartadosService.getPagoByApartado(this._apartado.idApartado).subscribe(response =>{
          if(response.exito){
            this.listPagos = response.respuesta
            this.faltante = 0 
            this.totalAbonos = 0
            this.listPagos.forEach(pagos => {
              this.totalAbonos += pagos.cantidad
            });
            
            if(this.totalAbonos >= this._apartado.precio){
              this.hacerPago = false
            }
            else{
              this.hacerPago = true
            }
            this.faltante = this._apartado.precio - this.totalAbonos
          }
      }
      )
    }

}
