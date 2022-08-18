import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MaterialesModel } from 'src/app/models/materiales.model';
import { MaterialesService } from 'src/app/services/materiales.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editMaterial: MaterialesModel;
  @Output() saveMaterial: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  material: MaterialesModel = new MaterialesModel();

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private materialesService: MaterialesService,
    private variablesGL: VariablesService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editMaterial){
          this.material = this._editMaterial;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.material = this._editMaterial;
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  hideDialog() {
    this.submitted = false;
    this.material = new MaterialesModel();
    this.variablesGL.showDialog.next(false);
  }

  saveDataMaterial(){
    this.submitted = true;
    if(this.material.nombre?.length > 0 && this.material.descripcion?.length > 2 && this.material.precio
      && this.material.tipoMedicion?.length > 0 && this.material.status?.length > 0 && this.material.stock){
      console.log('datos validos!!');
      console.log('data material ', this.material);

      if(this._accion == 'Agregar'){
        this.guardarMaterial();
      }else{
        this.actualizarMaterial();
      }
    }
  }

  guardarMaterial(){
    this.materialesService.agregaMaterial(this.material).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveMaterial.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add material ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarMaterial(){
    this.materialesService.actualizaMaterial(this.material).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveMaterial.emit(true);
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
