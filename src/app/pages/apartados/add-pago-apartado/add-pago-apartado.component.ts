import { Component, OnInit, Input, Output ,EventEmitter } from '@angular/core';
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

  @Input() _accion: string;
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
    this.pagoApartado = new PagoApartado()
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
      if(this._accion){
        this.accion = this._accion;
      }
  });
}

ngOnInit(): void {
  this.apartadosService.getPagoByApartado(this._apartado.idApartado).subscribe(response => {
    if (response.exito) {
      this.listPagos =  response.respuesta

    } else {
      this.variablesGL.hideLoading();
     
      this.toastr.error(response.mensaje, 'Error!');
    }
  }, err => {
    this.variablesGL.hideLoading();
    this.toastr.error('Hubo al obtener los articulos', 'Error!');
  });

 
  
}
  
ngOnDestroy() : void {
  this.pagoApartado = new PagoApartado()
}

  hideDialog() {
    this.submitted = false;
    this.variablesGL.showDialog.next(false);
    this.pagoApartado = new PagoApartado()
  }
  
  addPago(){
    this.submitted = true
    console.log(this.pagoApartado.fecha)
    if(this.pagoApartado.cantidad < this._apartado.precio && this.pagoApartado.fecha != "")
    {
    this.pagoApartado.idApartado = this._apartado.idApartado
    this.apartadosService.agregaPago(this.pagoApartado).subscribe(response =>{
      if(response.exito){
        this.hideDialog()
        this.pagoApartado = new PagoApartado()
        this.toastr.success('Abono realizado', 'Sucess');
        setTimeout(() => {
          
        }, 100);
      }
      else{
        this.toastr.success(response.mensaje, 'Error!');
      }
  })
  }}
}
