import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatProveedorModel } from 'src/app/models/proveedores.model';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  rows = 0;
  accion = '';
  cols: any[] = [];
  statusPantalla: number;
  loading: boolean = false;
  selectedProveedor: CatProveedorModel = new CatProveedorModel();
  selectedProveedores: CatProveedorModel[];
  listProveedores: CatProveedorModel[] = [];
  constructor(
    public variablesGL: VariablesService,
    private proveedoresService: ProveedoresService,
    private toastr: ToastrService,
  ) {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellidoPaterno', header: 'Apellido Paterno' },
      { field: 'apellidoMaterno', header: 'Apellido Materno' },
      { field: 'telefono1', header: 'Telefono 1' },
      { field: 'telefono2', header: 'Telefono 2' },
      { field: 'correo', header: 'Correo' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'encargadoNombre', header: 'Nombre Encargado' },
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
    this.getProveedores();
  }

  getProveedores(){
      this.loading = true;
      this.proveedoresService.getProveedores().subscribe(response => {
        if(response.exito){
          this.listProveedores = response.respuesta;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedProveedor = new CatProveedorModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  editProveedor(proveedor: CatProveedorModel){
    this.accion = 'Actualizar';
    this.selectedProveedor = {...proveedor};
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  deleteProveedor(proveedor: CatProveedorModel){
    Swal.fire({
      title: `Está seguro de eliminar el proveedor ${proveedor.nombre}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(proveedor);

        this.proveedoresService.eliminaProveedor(proveedor).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.getProveedores();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina proveedor ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

  deleteSelectedProveedores(){
    Swal.fire({
      title: `Está seguro de eliminar los ${this.selectedProveedores.length} proveedores?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
          this.selectedProveedores.forEach(prov => {
              this.proveedoresService.eliminaProveedor(prov).subscribe();
          });
      } else if (result.isDenied) {

      }
    });
  }


}
