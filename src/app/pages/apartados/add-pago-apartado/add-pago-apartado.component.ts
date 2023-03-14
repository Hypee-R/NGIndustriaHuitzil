import { Component, OnInit, Input, Output ,EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatClienteModel } from '../../../models/clientes.model';
import { productoModel } from '../../../models/productos.model';
import { CatTallaModel } from '../../../models/tallas.model';
import { CatApartadoModel } from '../../../models/apartado.model';
import { ToastrService } from 'ngx-toastr';
import { VariablesService } from '../../../services/variablesGL.service';
import { InventarioService } from '../../../services/inventario.service';
import { TallasService } from '../../../services/tallas.service';
import { ApartadosService } from '../../../services/apartados.service';

@Component({
  selector: 'app-add-pago-apartado',
  templateUrl: './add-pago-apartado.component.html',
  styleUrls: ['./add-pago-apartado.component.css']
})
export class AddPagoApartadoComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editCliente : CatClienteModel;
  @Output() saveApartado: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  cliente: CatClienteModel= new CatClienteModel();
  dialogSubscription: Subscription = new Subscription();
  nombreCompleto = ""
  filteredArticulos: productoModel[] = []
  listArticulos: productoModel[] = [];
  listTallas: CatTallaModel[] = [];
  clienteName: string = ''
  selectedArticuloAdvanced: productoModel
  apartado : CatApartadoModel = new CatApartadoModel()
  selectedTalla : number 

  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private tallasService:TallasService,
    private apartadosService: ApartadosService
    //private clientesService : ClientesService
  ) {
    //this.selectedArticuloAdvanced = new productoModel()
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
      if(this._editCliente){
        this.cliente = this._editCliente;
        this.nombreCompleto = this.cliente.nombre + " " + this.cliente.apellidoPaterno + " " + this.cliente.apellidoMaterno
      }
      if(this._accion){
        this.accion = this._accion;
      }
  });
}

ngOnInit(): void {
  this.inventarioService.getInexistencias().subscribe(response => {
    if (response.exito) {
      this.listArticulos = response.respuesta;
     // this.clientes = response.respuesta;
    
    } else {
      this.variablesGL.hideLoading();
     
      this.toastr.error(response.mensaje, 'Error!');
    }
  }, err => {
    this.variablesGL.hideLoading();
    this.toastr.error('Hubo al obtener los articulos', 'Error!');
  });

  this.tallasService.getTallas().subscribe(response => {
    if(response.exito){
      for(let talla of response.respuesta){
        this.listTallas.push(talla)
      }
    }
  }, err => {

  });
  
}
  
  getResultsArticulos(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.listArticulos.length; i++) {
      let articulo = this.listArticulos[i];
      if (articulo.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(articulo);
      }
    }
    this.filteredArticulos = filtered;
    this.clienteName=event.query;
    //this.crear = true
  }

}
