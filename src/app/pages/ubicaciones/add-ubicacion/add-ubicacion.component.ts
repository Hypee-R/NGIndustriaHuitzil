import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-add-ubicacion',
  templateUrl: './add-ubicacion.component.html',
  styleUrls: ['./add-ubicacion.component.css']
})
export class AddubicacionComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editubicacion: UbicacionModel;
  @Output() saveubicacion: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  ubicacion: UbicacionModel = new UbicacionModel();

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private UbicacionesService: UbicacionesService,
    private variablesGL: VariablesService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editubicacion){
          this.ubicacion = this._editubicacion;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.ubicacion = this._editubicacion;
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  hideDialog() {
    this.submitted = false;
    this.ubicacion = new UbicacionModel();
    this.variablesGL.showDialog.next(false);
  }

  saveDataubicacion(){
    this.submitted = true;
    if(this.ubicacion.direccion?.length > 0 && this.ubicacion.nombreEncargado?.length > 2){
      console.log('datos validos!!');
      console.log('data ubicacion ', this.ubicacion);

      if(this._accion == 'Agregar'){
        this.guardarubicacion();
      }else{
        this.actualizarubicacion();
      }
    }
  }

  guardarubicacion(){
    this.UbicacionesService.agregaUbicacion(this.ubicacion).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveubicacion.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add ubicacion ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarubicacion(){
    this.UbicacionesService.actualizaUbicacion(this.ubicacion).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveubicacion.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza ubicacion ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

}
