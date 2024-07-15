import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CatClienteModel } from 'src/app/models/clientes.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css']
})
export class AddClienteComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editCliente : CatClienteModel;
  @Output() saveCliente: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  cliente: CatClienteModel = new CatClienteModel();
  pattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  listSucursales: UbicacionModel = new UbicacionModel();
  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private clientesService: ClientesService,
    private ubicacionesService:UbicacionesService
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editCliente){
          this.cliente = this._editCliente;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    //this.proveedor = this._editProveedor;
    this.getSucursales();
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  getSucursales(){
    this.ubicacionesService.getUbicaciones().subscribe(response => {
      if(response.exito){
        this.listSucursales = response.respuesta;
        console.log( this.listSucursales)
      }
    });
  }

  hideDialog() {
    this.submitted = false;
    this.cliente = new CatClienteModel();
    this.variablesGL.showDialog.next(false);
  }

  addCliente(){
    this.submitted = true;
    if(this.cliente.nombre?.length > 2 ){
      console.log('datos validos!!');
      console.log('cliente ', this.cliente);

      if(this._accion == 'Agregar'){
        this.guardarCliente();
      }else{
        this.actualizarCliente();
      }

    }
  }

  guardarCliente(){
    console.log(this.cliente)
    this.clientesService.agregaCliente(this.cliente).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveCliente.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add proveedor ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarCliente(){
   this.clientesService.actualizaCliente(this.cliente).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveCliente.emit(true);
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
