import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CatProveedorModel } from 'src/app/models/proveedores.model';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrls: ['./add-proveedor.component.css']
})
export class AddProveedorComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editProveedor: CatProveedorModel;
  @Output() saveProveedor: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  proveedor: CatProveedorModel = new CatProveedorModel();
  pattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private proveedoresService: ProveedoresService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editProveedor){
          this.proveedor = this._editProveedor;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.proveedor = this._editProveedor;
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  hideDialog() {
    this.submitted = false;
    this.proveedor = new CatProveedorModel();
    this.variablesGL.showDialog.next(false);
  }

  saveUsuario(){
    this.submitted = true;
    if(this.proveedor.nombre?.length > 2 && this.proveedor.apellidoPaterno?.length > 2 && this.proveedor.apellidoMaterno?.length > 2 && this.proveedor.direccion?.length > 5
      && this.proveedor.telefono1?.length > 3 && this.proveedor.telefono2?.length == 10 && this.proveedor.correo.match(this.pattern) && this.proveedor.encargadoNombre?.length > 5){
      console.log('datos validos!!');
      console.log('data proveedor ', this.proveedor);

      if(this._accion == 'Agregar'){
        this.guardarProveedor();
      }else{
        this.actualizarProveedor();
      }

    }
  }

  guardarProveedor(){
    this.proveedoresService.agregaProveedor(this.proveedor).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveProveedor.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add proveedor ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarProveedor(){
    this.proveedoresService.actualizaProveedor(this.proveedor).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveProveedor.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza proveedor ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

}
