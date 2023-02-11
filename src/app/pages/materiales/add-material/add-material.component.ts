import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MaterialesModel } from 'src/app/models/materiales.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { MaterialesService } from 'src/app/services/materiales.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { CatProveedorModel } from '../../../models/proveedores.model';

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
  listProveedores: CatProveedorModel[] = [];
  listProveedoresAux: CatProveedorModel[] = [];
  listUbicaciones: UbicacionModel[] = [];
  listUbicacionesAux: UbicacionModel[] = [];
  lstTipoMedicion: string[] = ['BULTO', 'CAJA', 'KILO', 'ROLLO'];
  lstEstatus: string[] = ['DISPONIBLE', 'EXISTENCIA', 'SOLICITADO', 'RECIBIDO'];
  material: MaterialesModel = new MaterialesModel();

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private materialesService: MaterialesService,
    private proveedoresService: ProveedoresService,
    private ubicacionesService: UbicacionesService,
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
    this.getProveedores();
    this.getUbicaciones();
  }

  ngOnInit(): void {
    this.material = this._editMaterial;
  }

  getProveedores(){
    this.proveedoresService.getProveedores().subscribe(response => {
      if(response.exito){
        this.listProveedores = response.respuesta;
        this.listProveedoresAux = [...this.listProveedores];
        console.log('lista proveedores ', this.listProveedoresAux);
      }
    }, err => {
      this.listProveedores = [];
    });
  }

  getUbicaciones(){
    this.ubicacionesService.getUbicaciones().subscribe(response => {
      if(response.exito){
        this.listUbicaciones = response.respuesta;
        this.listUbicacionesAux = [...this.listUbicaciones];
        console.log('lista ubicaciones ', this.listUbicacionesAux);
      }
    }, err => {
      this.listUbicaciones = [];
    });
  }

  searchProveedor(event){
    console.log('event search ', event);
    this.listProveedoresAux = this.listProveedores.filter(x => x.encargadoNombre.toLowerCase().includes(event.query.toLowerCase()));
    console.log('results search ', this.listProveedoresAux);
  }

  searchUbicacion(event){
    console.log('event search ', event);
    this.listUbicacionesAux = this.listUbicaciones.filter(x => x.direccion.toLowerCase().includes(event.query.toLowerCase()));
    console.log('results search ', this.listProveedoresAux);
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
      console.log(response);
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
