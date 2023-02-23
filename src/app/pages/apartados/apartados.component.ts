import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatApartadoModel } from 'src/app/models/apartado.model';
import { CatClienteModel } from 'src/app/models/clientes.model';
import { ApartadosService } from 'src/app/services/apartados.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-apartados',
  templateUrl: './apartados.component.html',
  styleUrls: ['./apartados.component.css']
})
export class ApartadosComponent implements OnInit {
  statusPantalla: number
  selectedclienteNameAdvanced: CatClienteModel
  loading: boolean = false
  filteredClients: CatClienteModel[]
  clientes: CatClienteModel[]
  clienteName: string = ''
  crearApartado: boolean = false
  apartados : boolean = false
  accion = '';
  apartadoUsuario : CatApartadoModel
  apartadoByUser = false
  listApartados: CatApartadoModel[] = [];
  cols: any[] = [];
  rows = 0;
  botonEntregar = "Entregar Pedido"
  //crear : boolean = false
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private clientesService : ClientesService,
    private apartadoService : ApartadosService
 
  ) {
    this.selectedclienteNameAdvanced= new CatClienteModel() 
    this.statusPantalla = this.variablesGL.getStatusPantalla()
    this.cols = [
      { field: 'idArticulo', header: 'Articulo' },
      { field: 'idTalla', header: 'Talla' },
      { field: 'fecha', header: 'Fecha' },
      { field : 'fechaEntrega', header : 'Fecha Entrega'},
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'status', header : 'Status'}
    
    ];
  }

  ngOnInit(): void {

    this.clientesService.getClientes().subscribe(response => {
      if (response.exito) {
        this.clientes = response.respuesta;
      
      } else {
        this.variablesGL.hideLoading();
       
        this.toastr.error(response.mensaje, 'Error!');
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al buscar cliente', 'Error!');
    });
    
  }

  getResultsClients(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.clientes.length; i++) {
      let cliente = this.clientes[i];
      if (cliente.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(cliente);
      }
    }
    this.filteredClients = filtered;
    this.clienteName=event.query;
    //this.crear = true
  }
  
  cambie(){
    this.listApartados.shift()
    this.apartadoByUser = false
    this.crearApartado = false
  }

  consultaApartado(){
    this.listApartados.shift()
    if(this.selectedclienteNameAdvanced.idCliente != null && !this.apartados){
      
      
      this.apartadoService.getApartadoByUsuario(this.selectedclienteNameAdvanced.idCliente).subscribe(response =>{
        if(response.exito){
          console.log(response.respuesta)
          this.apartadoUsuario = response.respuesta
          this.listApartados.push(response.respuesta)
          this.crearApartado = false
          this.apartadoByUser = true
        }
        else{
          this.crearApartado = true
          this.apartadoByUser = false
        }
      })
    
      
    }
    else{
      this.toastr.error("Selecciona un cliente", 'Error!');
    }
  }

  openAddApartado(){
    this.accion = 'Apartar';
    //this.selectedCliente = new CatClienteModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  entregarPedido(apartado : CatApartadoModel){
    let newApartado = apartado
    //newApartado.fechaEntrega = "2023-02-15T00:00:00"
    //newApartado.status = "Entregado"
    this.apartadoService.actualizaApartado(newApartado).subscribe(request =>{
      if(request.exito){
        this.toastr.success("Apartado Entregado","Correcto")
      }
      else{
        this.toastr.error(request.mensaje,"Error")
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al entregar el Apartado', 'Error!');
    });
  }

}
