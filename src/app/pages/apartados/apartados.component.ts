import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatApartadoModel } from 'src/app/models/apartado.model';
import { CatClienteModel } from 'src/app/models/clientes.model';
import { PagoApartado } from 'src/app/models/pagoApartado';
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
  selectedApartado : CatApartadoModel
  loading: boolean = false
  filteredClients: CatClienteModel[]
  clientes: CatClienteModel[]
  clienteName: string = ''
  crearApartado: boolean = false
  crearPedido : boolean  = false
  apartados : boolean = false
  accion = '';
  accionAdd = '';
  accionPago = ""
  accionPedido = ''
  accionPagoPedido = ''
  apartadoUsuario : CatApartadoModel
  apartadoByUser = false
  listApartados: CatApartadoModel[] = [];
  listPedidos: CatApartadoModel[] = [];
  listPagos : PagoApartado[] = []
  listArticulosApartados :  CatApartadoModel [] = []
  cols: any[] = [];
  colsPedidos  = [];
  rows = 0;
  botonEntregar = "Entregar Pedido"
  botonHacerAbono  = "Hacer un abono"
  //Pedidos especiales
  showPedidos = false
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
      { field: 'talla', header: 'Talla' },
      { field : 'precio', header :'Precio'},
      { field: 'fecha', header: 'Fecha' },
      { field : 'fechaEntrega', header : 'Fecha Entrega'},
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'status', header : 'Status'}
    
    ];

    this.colsPedidos = [
      { field: 'idPedido', header: 'ID PEDIDO' },
      { field: 'fecha', header: 'Fecha' },
      { field : 'fechaEntrega', header : 'Fecha Entrega'},
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'status', header : 'Status'}
    
    ];

    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 4;
    }else{
      this.rows = 8;
    }
  }

  ngOnInit(): void {

   this.getClientes()
    
  }

  getClientes(){
    this.clientes= []
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
  }
  
  cambie(){
    this.listApartados.shift()
    this.listPedidos.shift()
    this.apartadoByUser = false
    this.crearApartado = false
    this.showPedidos = false
  }

  consultaApartado(){
    this.accion = ""
    this.listApartados.shift()
    
    if(this.selectedclienteNameAdvanced.idCliente != 0 && !this.apartados){
      this.showPedidos = false
      this.crearApartado = true
      this.apartadoService.getApartadoByUsuario(this.selectedclienteNameAdvanced.idCliente,"A").subscribe(response =>{
        if(response.exito){
          console.log(response.respuesta)
          this.listApartados = response.respuesta
          console.log(this.listApartados)
          this.listApartados.forEach(apartado => {
            if(apartado.status == "Espera"){
              this.crearApartado = false
              return
            }
          });
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
    this.accionAdd = ""
    this.accionPedido = ''
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  entregarPedido(apartado : CatApartadoModel,type : String){
    let d = new Date()
    let newApartado = apartado
    newApartado.fechaEntrega = d.toISOString().substring(0, 19);
    newApartado.status = "Entregado"
    this.apartadoService.actualizaApartado(newApartado).subscribe(request =>{
      if(request.exito){
        this.toastr.success("Apartado Entregado","Correcto")

      }
      else{
        this.toastr.error(request.mensaje,"Error")
      }
      setTimeout(() => {
        if(type == "A"){
        this.consultaApartado()}
        else{
          this.consultarPedidoEspecial()
        }
      }, 200);
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al entregar el Apartado', 'Error!');
    });
    
    
    
  } 
  consultarPedidoEspecial(){
    this.accion = ""
    this.crearApartado = false
    this.apartadoByUser = false
    if(this.selectedclienteNameAdvanced.idCliente != 0 && !this.apartados){
      this.showPedidos =  true
      this.crearPedido = true
      this.apartadoService.getApartadoByUsuario(this.selectedclienteNameAdvanced.idCliente,"E").subscribe(response =>{
        if(response.exito){
          console.log(response.respuesta)
          this.listPedidos = response.respuesta
   
          this.listPedidos.forEach(apartado => {
            if(apartado.status == "Espera"){
              this.crearPedido = false
              return
            }
          });
         
         // this.apartadoByUser = true
        }
      else{
        this.crearPedido = true
         /* this.crearApartado = true
          this.apartadoByUser = false*/
        }
      })
    }
    else{
      this.toastr.error("Selecciona un cliente", 'Error!');
    }
    
  }

  openAddPedido(){
    this.accionPago = ''
    this.accionAdd = ""
    this.accionPedido = 'Pedido';
  
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  openModalAdd(){
    this.accion = ''
    this.accionAdd = "Agregar"
    this.accionPedido  = ''
    this.accionPago = ""
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  makePay(apartado : CatApartadoModel){
    
    this.apartadoService.getPagoByApartado(apartado.idApartado).subscribe(response => {
    if (response.exito) {
      this.listPagos =  response.respuesta
      this.accion = ""
      this.accionAdd = ''
      this.accionPedido = ''
      this.accionPago = "Add"
      this.selectedApartado = apartado
      setTimeout(() => {
        this.variablesGL.showDialog.next(true);
      }, 300);
    } else {
      this.variablesGL.hideLoading();
     
      this.toastr.error(response.mensaje, 'Error!');
    }
  }, err => {
    this.variablesGL.hideLoading();
    this.toastr.error('Hubo al obtener los pagos', 'Error!');
  });
  
  }

  makePayPedido(apartado:CatApartadoModel){
    this.accionPago = "Pedidos"
    
    this.apartadoService.getApartadoByUsuario(this.selectedclienteNameAdvanced.idCliente,"I").subscribe(responce =>{
      if(responce.exito){
        //console.log(responce.respuesta)
        this.listArticulosApartados = responce.respuesta
        setTimeout(() => {
          this.variablesGL.showDialog.next(true);
        }, 100);
      }
    })
    /*this.apartadoService.getPagoByApartado(apartado.idApartado).subscribe(response => {
      if (response.exito) {
        this.listPagos =  response.respuesta
        this.accion = ""
        this.accionAdd = ''
        this.accionPedido = ''
        this.accionPago = "Add"
        this.selectedApartado = apartado
        setTimeout(() => {
          this.variablesGL.showDialog.next(true);
        }, 300);
      } else {
        this.variablesGL.hideLoading();
       
        this.toastr.error(response.mensaje, 'Error!');
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo al obtener los pagos', 'Error!');
    });*/
  }
}
