import { Component, Input, OnInit, EventEmitter,Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
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
export class AddPedidoEspecialComponent implements OnInit,OnChanges,OnDestroy {


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
  selectedTalla : CatTallaModel
  listArticulosSelected: productoModel[] = []
  cols: any[] = [];
  rows = 5;
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private tallasService:TallasService,
    private apartadosService: ApartadosService

  ) {
    this.listArticulosSelected = []
    this.cols = [
      { field: 'descripcion', header: 'Articulo' },
      { field: 'talla', header: 'Talla' },
      { field : 'precio', header :'Precio'},
    ];
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
  ngOnDestroy(): void {
      this.listArticulosSelected = []
  }
  ngOnChanges(changes: SimpleChanges): void {
      this.listArticulosSelected = []
  }
  ngOnInit(): void {
    this.listArticulosSelected = []
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
    let apartadoCorrecto = true
    if(this.listArticulosSelected.length != 0)
    {
      if(this.apartado.fecha == ""){
        this.toastr.error('Faltan datos', 'Error!');
      }
      this.apartado.idEmpleado = this.cliente.idCliente
      this.apartado.idArticulo = this.listArticulosSelected[0].idArticulo
      this.apartado.direccion = this.cliente.direccion
      this.apartado.telefono = this.cliente.telefono1
      this.apartado.type = "E"
      this.apartado.idTalla = this.listArticulosSelected[0].idTalla

      this.apartadosService.agregaApartado(this.apartado).subscribe(response =>{
            if(response.exito){

              this.listArticulosSelected.forEach(articulo => {
                
                let newApartado = new CatApartadoModel
                newApartado.idEmpleado = this.cliente.idCliente
                newApartado.idArticulo = articulo.idArticulo
                newApartado.direccion = this.cliente.direccion
                newApartado.telefono = this.cliente.telefono1
                newApartado.type = "I"
                newApartado.fecha = this.apartado.fecha
                newApartado.idTalla = articulo.idTalla
                console.log(newApartado)
                this.apartadosService.agregaApartado(newApartado).subscribe(response =>{
                  if(!response.exito){
                    apartadoCorrecto  = false
                    //return
                  }
                  else{
                    console.log(response.exito)
                  }
                })
                
              });
              if(apartadoCorrecto){
              this.hideDialog()
              this.toastr.success('Apartado Correcto', 'Sucess');
              setTimeout(() => {
                this.saveApartado.emit(true);
              }, 100);
              }
            }
            else{
              this.toastr.error(response.mensaje, 'Error!');
            }
        })
    }
      else{
        this.toastr.error("Seleeciona un articulo", 'Error!');
      }
    
  }

  addArticles(){
    
    if(this.selectedArticuloAdvanced == undefined){
      this.toastr.error("Selecciona un articulo","Error!")
    }
    else{
    this.listArticulosSelected.push(this.selectedArticuloAdvanced)
    console.log(this.listArticulosSelected)
    console.log(this.selectedArticuloAdvanced)}
  }

  deleteArticle(articulo :productoModel){
      let index = this.listArticulosSelected.indexOf(articulo)
      this.listArticulosSelected.splice(index,1)
  }
}
