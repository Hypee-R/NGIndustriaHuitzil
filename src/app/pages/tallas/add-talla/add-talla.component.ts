import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { TallasService } from 'src/app/services/tallas.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-add-talla',
  templateUrl: './add-talla.component.html',
  styleUrls: ['./add-talla.component.css']
})
export class AddTallaComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editTalla: CatTallaModel;
  @Output() saveTalla: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  talla: CatTallaModel = new CatTallaModel();

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private tallasService: TallasService,
    private variablesGL: VariablesService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editTalla){
          this.talla = this._editTalla;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.talla = this._editTalla;
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  hideDialog() {
    this.submitted = false;
    this.talla = new CatTallaModel();
    this.variablesGL.showDialog.next(false);
  }

  saveDataTalla(){
    this.submitted = true;
    if(this.talla.nombre?.length > 0 && this.talla.descripcion?.length > 2){
      console.log('datos validos!!');
      console.log('data talla ', this.talla);

      if(this._accion == 'Agregar'){
        this.guardarTalla();
      }else{
        this.actualizarTalla();
      }
    }
  }

  guardarTalla(){
    this.tallasService.agregaTalla(this.talla).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveTalla.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add talla ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarTalla(){
    this.tallasService.actualizaTalla(this.talla).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveTalla.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza talla ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

}
