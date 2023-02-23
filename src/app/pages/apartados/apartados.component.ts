import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatClienteModel } from 'src/app/models/clientes.model';
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
  crear : boolean = false
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private clientesService : ClientesService
 
  ) {
    this.selectedclienteNameAdvanced= new CatClienteModel() 
    this.statusPantalla = this.variablesGL.getStatusPantalla()
  
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
    this.crear = true
  }

  nuevoApartado(){
    //console.log(this.selectedclienteNameAdvanced)
    //console.log(this.selectedclienteNameAdvanced.idCliente)
    if(this.selectedclienteNameAdvanced.idCliente != null){
      this.crearApartado = true
    }
    
  }

}
