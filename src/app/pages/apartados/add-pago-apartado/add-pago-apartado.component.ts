import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatApartadoModel } from '../../../models/apartado.model';
import { ToastrService } from 'ngx-toastr';
import { VariablesService } from '../../../services/variablesGL.service';
import { InventarioService } from '../../../services/inventario.service';
import { TallasService } from '../../../services/tallas.service';
import { ApartadosService } from '../../../services/apartados.service';
import { PagoApartado } from 'src/app/models/pagoApartado';

@Component({
  selector: 'app-add-pago-apartado',
  templateUrl: './add-pago-apartado.component.html',
  styleUrls: ['./add-pago-apartado.component.css']
})
export class AddPagoApartadoComponent implements OnInit {

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

ngOnInit(): void {
  this.listPagos = this._listPagos
  this._listPagos.forEach(pagos => {
    this.totalAbonos += pagos.cantidad
    
  });
  
  if(this.totalAbonos > this._apartado.precio){
    this.hacerPago = false
  }
  console.log(this.totalAbonos)
  console.log(this._apartado.precio)
 
}
close(){
  this.ngOnDestroy()
  this.listPagos = []
}
ngOnDestroy() : void {
  
  this.pagoApartado = new PagoApartado()
}

  hideDialog() {
    this.listPagos = []
    this.submitted = false;
    //this.variablesGL.showDialog.next(false);
    this.pagoApartado = new PagoApartado()
    this.ngOnDestroy
  }
  
  addPago(){
    this.submitted = true
    console.log(this.pagoApartado.fecha)
    if(this.pagoApartado.cantidad < this._apartado.precio && this.pagoApartado.fecha != "")
    {
    this.pagoApartado.idApartado = this._apartado.idApartado
    this.apartadosService.agregaPago(this.pagoApartado).subscribe(response =>{
      if(response.exito){
        //this.hideDialog()
        //this.pagoApartado = new PagoApartado()
        this.toastr.success('Abono realizado', 'Sucess');
        setTimeout(() => {
          
        }, 200);
      }
      else{
        this.toastr.success(response.mensaje, 'Error!');
      }
  })
  }}
}
