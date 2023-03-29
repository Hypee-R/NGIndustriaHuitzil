import { Component, Input, OnInit, EventEmitter,Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CatApartadoModel } from 'src/app/models/apartado.model';
import { CatClienteModel } from 'src/app/models/clientes.model';
import { productoModel } from 'src/app/models/productos.model';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { ApartadosService } from 'src/app/services/apartados.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { TallasService } from 'src/app/services/tallas.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-add-pedido-especial',
  templateUrl: './add-pedido-especial.component.html',
  styleUrls: ['./add-pedido-especial.component.css']
})
export class AddPedidoEspecialComponent implements OnInit {


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

  ) {
 
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
    this.inventarioService.getArticulos().subscribe(response => {
      if (response.exito) {
        this.listArticulos = response.respuesta;
    
      
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

  hideDialog() {
    this.submitted = false;
    this.variablesGL.showDialog.next(false);
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
  }

  addApartado(){
    this.apartado.idEmpleado = this.cliente.idCliente
    this.apartado.idArticulo = this.selectedArticuloAdvanced.idArticulo
    this.apartado.direccion = this.cliente.direccion
    this.apartado.telefono = this.cliente.telefono1
    this.apartado.idTalla = this.selectedTalla
    this.apartado.type = "E"
    if(this.apartado.idArticulo == undefined || this.apartado.idTalla == undefined || this.apartado.fecha == "" || this.apartado.idArticulo == 0){
      this.toastr.error('Faltan datos', 'Error!');
    }
    else{

      this.apartadosService.agregaApartado(this.apartado).subscribe(response =>{
          if(response.exito){
            this.hideDialog()
            this.toastr.success('Articulo Apartado', 'Sucess');
            setTimeout(() => {
              this.saveApartado.emit(true);
            }, 100);
          }
          else{
            this.toastr.success(response.mensaje, 'Error!');
          }
      })
      
    }
    /*console.log(this.selectedTalla)
    console.log(this.apartado)*/
  }

}
