import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CajaModel } from 'src/app/models/caja.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from '../../../services/ventas.service';


@Component({
  selector: 'app-open-cash',
  templateUrl: './open-cash.component.html',
  styleUrls: ['./open-cash.component.css']
})
export class OpenCashComponent implements OnInit {
  @Input() _accion: string;
  @Input() _caja: CajaModel;
  rows = 0;
  accion = '';
  submitted = false;
  visibleDialog = true;
  fecha: Date;
  fechaCierre: Date;
  openCashModel: CajaModel = new CajaModel();
  dialogSubscription: Subscription = new Subscription();
  datePipe = new DatePipe("en-US");
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private ventasService: VentasService,
  ) {

    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;

      if(this.visibleDialog){
        if(this._accion){
          this.accion = this._accion;
        }
        if(this._caja){
          this.openCashModel = this._caja;
          this.fecha = this.openCashModel.fecha != '' ? this.variablesGL.getFormatoFecha(this.openCashModel.fecha) : new Date();
          if(this.accion == 'Cerrar'){
            this.fechaCierre = null;
          }
          if(this.openCashModel.montoCierre != null && this.accion == 'Status'){
            this.fechaCierre = this.openCashModel.fechaCierre != null ? this.variablesGL.getFormatoFecha(this.openCashModel.fechaCierre) : new Date();
          }
        }
      }
    });

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
  }

  ngOnDestroy(): void {
    if(this.dialogSubscription){
      this.dialogSubscription.unsubscribe();
    }
  }

  hideDialog() {
    this.submitted = false;
    this.openCashModel = new CajaModel();
    this.variablesGL.showDialog.next(false);
  }

  saveCaja(){
    this.submitted = true;
    this.openCashModel.fecha = this.fecha ? this.variablesGL.setFormatoFecha(this.fecha) : '';
    this.openCashModel.fechaCierre = this.fechaCierre ? this.variablesGL.setFormatoFecha(this.fechaCierre) : '';
    console.log('datos ', this.openCashModel);

    if(this.accion == 'Abrir' && this.openCashModel.monto > 0 && this.openCashModel.fecha.length > 0){
        console.log('Agregar');
        this.ventasService.openCaja(this.openCashModel).subscribe(response => {
            console.log(response);
            if(response.exito){
                this.toastr.success(response.mensaje, 'Exito!');
                this.submitted = false;
                this.variablesGL.showDialog.next(false);
            }else{
                this.toastr.info(response.mensaje, 'Atención!')
            }
        },
        err => {
          console.log('error -> ', err);
          this.toastr.error('Ocurrió un error al hacer la operación','Error!');
        });
    }else if(this.accion == 'Cerrar' && this.openCashModel.montoCierre > 0 && this.openCashModel.fechaCierre.length > 0){
      if(this.fechaCierre > this.fecha){
        console.log('Actualizar');
        this.ventasService.closeCaja(this.openCashModel).subscribe(response => {
          console.log(response);
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!');
              this.submitted = false;
              this.variablesGL.showDialog.next(false);
            }else{
              this.toastr.info(response.mensaje, 'Atención!')
          }
        },
        err => {
          console.log('error -> ', err);
          this.toastr.error('Ocurrió un error al hacer la operación','Error!');
        });
      }else{
        this.toastr.error('La fecha de cierre debe ser posterior a la fecha que se abrió la caja', 'Error');
      }
    }
  }

}
