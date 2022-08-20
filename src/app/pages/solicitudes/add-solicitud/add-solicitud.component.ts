import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MaterialesModel } from 'src/app/models/materiales.model';
import { ProveedorMaterialModel } from 'src/app/models/proveedores-materiales.model';
import { CatProveedorModel } from 'src/app/models/proveedores.model';
import { MaterialesService } from 'src/app/services/materiales.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { SolicitudesMaterialModel } from '../../../models/solicitudes.model';
import { SolicitudesService } from '../../../services/solicitudes.service';

@Component({
  selector: 'app-add-solicitud',
  templateUrl: './add-solicitud.component.html',
  styleUrls: ['./add-solicitud.component.css']
})
export class AddSolicitudComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editSolicitud: SolicitudesMaterialModel;
  @Output() saveSolicitud: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  activeProv = true;
  visibleDialog: boolean;
  accion = '';
  listMateriales: MaterialesModel[] = [];
  listProveedores: CatProveedorModel[] = [];
  listProveedoresMateriales: ProveedorMaterialModel[] = [];
  materialSelectedId: number;
  proveedorSelectedId: number;

  solicitud: SolicitudesMaterialModel = new SolicitudesMaterialModel();

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private materialesService: MaterialesService,
    private solicitudesService: SolicitudesService,
    private variablesGL: VariablesService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.getMateriales();
        this.visibleDialog = estado;
        this.materialSelectedId = undefined;
        this.proveedorSelectedId = undefined;
        if(this._editSolicitud){
          this.solicitud = this._editSolicitud;
          this.materialSelectedId = this._editSolicitud.proveedorMaterial?.idMaterial;
          this.proveedorSelectedId = this._editSolicitud.proveedorMaterial?.idProveedor
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.solicitud = this._editSolicitud;
  }

  getMateriales(){
    this.materialesService.getMateriales().subscribe(response => {
      if(response.exito){
        this.listMateriales = response.respuesta;
        console.log('lista materiales ', this.listMateriales);
        this.getProveedoresMateriales();
      }
    }, err => {
      this.listProveedores = [];
    });
  }

  getProveedoresMateriales(){
    this.solicitudesService.getProveedoresMateriales().subscribe(response => {
      if(response.exito){
        this.listProveedoresMateriales = response.respuesta;
        console.log('lista proveedores materiales ', this.listProveedoresMateriales);
        //Esto se hace para poblar el combo de proveedores
        if(this._editSolicitud){

          this.setProveedores();

        }
      }
    }, err => {
      this.listProveedores = [];
    });
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  setProveedores(){
    if(this.materialSelectedId){
      this.listProveedores = this.listMateriales.find(x => x.idMaterial == this.materialSelectedId)?.proveedores;
      this.activeProv = false;
    }else{
      this.listProveedores = [];
      this.activeProv = true;
    }
  }

  setProveedorMaterial(){
      if(this.materialSelectedId && this.proveedorSelectedId){
        let proveedorMaterial = this.listProveedoresMateriales.find(x => x.idMaterial == this.materialSelectedId && x.idProveedor == this.proveedorSelectedId);
        this.solicitud.idProveedorMaterial = proveedorMaterial.idProveedorMaterial;
      }else{
        this.solicitud.idProveedorMaterial = 0;
      }
  }

  setCostoTotal(){
    this.solicitud.costoTotal = this.listMateriales.find(x => x.idMaterial == this.materialSelectedId).precio * this.solicitud.cantidad;
  }

  hideDialog() {
    this.submitted = false;
    this.solicitud = new SolicitudesMaterialModel();
    this.variablesGL.showDialog.next(false);
  }

  saveDataSolicitud(){
    this.submitted = true;
    if(this.solicitud.cantidad > 0 && this.solicitud.comentarios?.length > 0 && this.solicitud.status?.length > 0
      && this.solicitud.idProveedorMaterial != 0 && this.solicitud.costoTotal > 0){
      let usuarioLogged = JSON.parse(localStorage.getItem('usuario'));
      this.solicitud.idUser = usuarioLogged.id;
      console.log('datos validos!!');
      console.log('data solicitud ', this.solicitud);

      if(this._accion == 'Agregar'){
        this.guardarSolicitud();
      }else{
        this.solicitud.usuario = null;
        this.solicitud.proveedorMaterial = null;
        this.actualizarSolicitud();
      }
    }
  }

  guardarSolicitud(){
    this.solicitudesService.agregaSolicitud(this.solicitud).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveSolicitud.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add material ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarSolicitud(){
    this.solicitudesService.actualizaSolicitud(this.solicitud).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveSolicitud.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza solicitud material ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

}
