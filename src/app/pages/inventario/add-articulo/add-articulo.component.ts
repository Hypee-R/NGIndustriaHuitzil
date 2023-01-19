import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { productoModel } from 'src/app/models/productos.model';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { TallasService } from 'src/app/services/tallas.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-add-articulo',
  templateUrl: './add-articulo.component.html',
  styleUrls: ['./add-articulo.component.css']
})
export class AddArticuloComponent implements OnInit {

  @Input() _accion: string;
  @Input() _editproducto:productoModel;
  @Output() saveProducto: EventEmitter<boolean> = new EventEmitter<boolean>();


  submitted = false;
  visibleDialog: boolean;
  accion = '';
  producto: productoModel = new productoModel();
  pattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';


  listCategorias: CategoriaModel[] = [];
  listTallas: CatTallaModel[] = [];
  listUbicaciones: UbicacionModel[] = [];


  selectedCategoria: CategoriaModel;
  selectedTalla: CatTallaModel;
  selectedUbicacion: UbicacionModel;


  dialogSubscription: Subscription = new Subscription();

  archivos=[]
  previsualizacion: "'assets/img/default-image.jpg'" ;
 //previsualizacion: "" ;


  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private articuloService: InventarioService,
    private categoriasService:CategoriasService,
    private tallasService:TallasService,
    private ubicacionesService:UbicacionesService,
    private sanitizer: DomSanitizer
    ) {
      this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        if(this._editproducto){
          this.producto = this._editproducto;
        }
        if(this._accion){
          this.accion = this._accion;
        }
    });

    }

  ngOnInit(): void {
    this.producto = this._editproducto;
    this.getCampos();


  }

  ngOnDestroy(): void {
    if(this.dialogSubscription){
      this.dialogSubscription.unsubscribe();
    }


}
hideDialog() {
  this.submitted = false;
  this.producto = new productoModel();
  this.variablesGL.showDialog.next(false);
}



saveArticulo(){
  this.submitted = true;

  if(this.producto.existencia?.length >1){
    //console.log('datos validos!!');
    //console.log('data proveedor ', this.proveedor);

    if(this._accion == 'Agregar'){
      this.guardarArticulo();
    }else{
      this.actualizarArticulo();
    }

  }
}

getCampos(){

  this.categoriasService.getCategorias().subscribe(response => {
    if(response.exito){
      for(let categoria of response.respuesta){
        this.listCategorias.push(categoria)
      }
    }
  }, err => {

  });


  this.tallasService.getTallas().subscribe(response => {
    if(response.exito){
      for(let talla of response.respuesta){
        this.listTallas.push(talla)
      }
    }
  }, err => {

  });


  this.ubicacionesService.getUbicaciones().subscribe(response => {
    if(response.exito){
      for(let ubicacion of response.respuesta){
        this.listUbicaciones.push(ubicacion)
      }
      if(this.variablesGL.getSucursal()){
        let ubiPreselected = this.listUbicaciones.find(x => x.direccion == this.variablesGL.getSucursal());
        this.producto.idUbicacion = ubiPreselected.idUbicacion;
      }
    }
  }, err => {

  });
}

guardarArticulo(){

  this.articuloService.agregaArticulo(this.producto).subscribe(response => {
    if(response.exito){
        this.toastr.success(response.mensaje, 'Exito!!');
        this.hideDialog();
        setTimeout(() => {
          this.saveProducto.emit(true);
        }, 100);
    }else{
        this.toastr.error(response.mensaje, 'Ups!!');
    }
  }, err => {
    console.log('error add proveedor ', err);
    this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
  });
}

actualizarArticulo(){
  console.log(this.producto)
  this.articuloService.actualizaArticulo(this.producto).subscribe(response => {
    if(response.exito){
        this.toastr.success(response.mensaje, 'Exito!!');
        this.hideDialog();
        setTimeout(() => {
          this.saveProducto.emit(true);
        }, 100);
    }else{
        this.toastr.error(response.mensaje, 'Ups!!');
    }
  }, err => {
    console.log('error actualiza proveedor ', err);
    this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
  });
}

capturarFile(event){
  const fotografiaCaptura=event.target.files[0]
  this.extraerBase64(fotografiaCaptura).then((imagen: any) => {
    this.previsualizacion = imagen.base;
    this.producto.imagen=imagen.base
    //console.log(imagen['base']);
  })
  //this.archivos.push(fotografiaCaptura)


}

extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
  try {
    const unsafeImg = window.URL.createObjectURL($event);
    const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    const reader = new FileReader();
    reader.readAsDataURL($event);
    reader.onload = () => {
      resolve({
        base: reader.result
      });
    };
    reader.onerror = error => {
      resolve({
        base: null
      });
    };

  } catch (e) {
    return null;
  }
})

}
