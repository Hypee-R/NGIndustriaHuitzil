import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { CategoriasService } from 'src/app/services/categorias.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-add-categoria',
  templateUrl: './add-categoria.component.html',
  styleUrls: ['./add-categoria.component.css']
})
export class AddcategoriaComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editcategoria: CategoriaModel;
  @Output() savecategoria: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted = false;
  visibleDialog: boolean;
  accion = '';
  categoria: CategoriaModel = new CategoriaModel();

  dialogSubscription: Subscription = new Subscription();
  constructor(
    private toastr: ToastrService,
    private CategoriasService: CategoriasService,
    private variablesGL: VariablesService,
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editcategoria){
          this.categoria = this._editcategoria;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });
  }

  ngOnInit(): void {
    this.categoria = this._editcategoria;
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  hideDialog() {
    this.submitted = false;
    this.categoria = new CategoriaModel();
    this.variablesGL.showDialog.next(false);
  }

  saveDatacategoria(){
    this.submitted = true;
    if(this.categoria.nombre?.length > 0 && this.categoria.descripcion?.length > 2){
      console.log('datos validos!!');
      console.log('data categoria ', this.categoria);

      if(this._accion == 'Agregar'){
        this.guardarcategoria();
      }else{
        this.actualizarcategoria();
      }
    }
  }

  guardarcategoria(){
    this.CategoriasService.agregacategoria(this.categoria).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.savecategoria.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add categoria ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  actualizarcategoria(){
    this.CategoriasService.actualizacategoria(this.categoria).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.savecategoria.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza categoria ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

}
