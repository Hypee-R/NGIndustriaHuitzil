import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { MaterialesModel } from 'src/app/models/materiales.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialesService } from 'src/app/services/materiales.service';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent implements OnInit {

  rows = 0;
  accion = '';
  cols: any[] = [];
  statusPantalla: number;
  loading: boolean = false;
  selectedMaterial: MaterialesModel = new MaterialesModel();
  selectedMateriales: MaterialesModel[];
  listMateriales: MaterialesModel[] = [];
  constructor(
    public variablesGL: VariablesService,
    private materialesService: MaterialesService,
    private toastr: ToastrService,
  ) {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'precio', header: 'Precio' },
      { field: 'tipoMedicion', header: 'Tipo Medición' },
      { field: 'status', header: 'Status' },
      { field: 'stock', header: 'Stock' },
      { field: 'proveedores', header: 'Proveedores' },
      { field: 'ubicaciones', header: 'Ubicaciones' },
    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 5;
    }else{
      this.rows = 11;
    }
  }

  ngOnInit(): void {
    this.getMateriales();
  }

  getMateriales(){
      this.loading = true;
      this.materialesService.getMateriales().subscribe(response => {
        if(response.exito){
          console.log(response.respuesta);

          this.listMateriales = response.respuesta;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }

  openModalAdd(){
    this.accion = 'Agregar';
    this.selectedMaterial = new MaterialesModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  editMaterial(material: MaterialesModel){
    this.accion = 'Actualizar';
    this.selectedMaterial = {...material};
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  deleteMaterial(material: MaterialesModel){
    Swal.fire({
      title: `Está seguro de eliminar el material ${material.nombre}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(material);

        this.materialesService.eliminaMaterial(material).subscribe(response => {
          if(response.exito){
              this.toastr.success(response.mensaje, 'Exito!!');
              this.getMateriales();
          }else{
              this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error elimina material ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }

  deleteSelectedMaterial(){
    Swal.fire({
      title: `Está seguro de eliminar los ${this.selectedMateriales.length} materiales?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
          this.selectedMateriales.forEach(us => {
              this.materialesService.eliminaMaterial(us).subscribe();
          });
      } else if (result.isDenied) {

      }
    });
  }

}
