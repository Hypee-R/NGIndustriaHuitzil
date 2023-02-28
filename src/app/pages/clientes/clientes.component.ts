import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatProveedorModel } from 'src/app/models/proveedores.model';
//import { ProveedoresService } from 'src/app/services/proveedores.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CatClienteModel } from 'src/app/models/clientes.model';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  rows = 0;
  accion = '';
  cols: any[] = [];
  statusPantalla: number;
  loading: boolean = false;
  selectedCliente: CatClienteModel = new CatClienteModel();
  selectedClientes: CatClienteModel[];
  listClientes: CatClienteModel[] = [];
  constructor(
    public variablesGL: VariablesService,
    private clientesService: ClientesService,
    private toastr: ToastrService,
  ) {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellidoPaterno', header: 'Apellido Paterno' },
      { field: 'apellidoMaterno', header: 'Apellido Materno' },
      { field: 'telefono1', header: 'Telefono 1' },
      { field: 'telefono2', header: 'Telefono 2' },
      { field: 'direccion', header: 'Dirección' },
    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 4;
    }else{
      this.rows = 11;
    }
  }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(){
      this.loading = true;
      this.clientesService.getClientes().subscribe(response => {
        if(response.exito){
          //console.log(response.respuesta)
          this.listClientes = response.respuesta
          //this.listProveedores = response.respuesta;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedCliente = new CatClienteModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  editProveedor(cliente: CatClienteModel){
    this.accion = 'Actualizar';
    this.selectedCliente = {...cliente};
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }
  
  deleteCliente(cliente: CatClienteModel){
    Swal.fire({
      title: `Está seguro de eliminar el cliente ${cliente.nombre}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminaCliente(cliente).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.getClientes();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina el cliente ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

 deleteSelectedClientes(){
    Swal.fire({
      title: `Está seguro de eliminar los ${this.selectedClientes.length} clientes?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
          this.selectedClientes.forEach(cliente => {
              this.clientesService.eliminaCliente(cliente).subscribe();
          });
      } else if (result.isDenied) {

      }
    });
  }


}
