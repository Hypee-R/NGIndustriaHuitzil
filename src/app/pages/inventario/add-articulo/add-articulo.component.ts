import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { productoModel } from 'src/app/models/productos.model';
// import { CatTallaModel } from 'src/app/models/tallas.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { TallasService } from 'src/app/services/tallas.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UsuarioAuthModel } from 'src/app/models/usuario-auth.model';



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

  lstEstatus: string[] = ['TRANSITO', 'UBICACION'];
  listCategorias: CategoriaModel[] = [];
  // listTallas: CatTallaModel[] = [];
  listUbicaciones: UbicacionModel[] = [];


  selectedCategoria: CategoriaModel;
  // selectedTalla: CatTallaModel;
  selectedUbicacion: UbicacionModel;


  dialogSubscription: Subscription = new Subscription();

  user: UsuarioAuthModel;
  archivos=[]
  previsualizacion;
  sku = ""
  noEtiquetas = []
  noEtiquetasPrint = 0
 //previsualizacion: "" ;

  imageSource;
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
        this.previsualizacion = "'assets/img/default-image.jpg'"
        if(this._editproducto){
          this.producto = this._editproducto;
          this.previsualizacion = this.sanitizer.bypassSecurityTrustResourceUrl(this._editproducto.imagen)
          this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(this._editproducto.imagen);
        }
        if(this._accion){
          this.accion = this._accion;
        }
        if(this._accion == "Codigo de Barras"){
            this.noEtiquetas = []
            this.sku = this._editproducto.sku
            this.noEtiquetasPrint = 1
            for (let i = 0 ; i< Number(this._editproducto.existencia); i++){
                this.noEtiquetas.push(1)
            }

        }
    });

    }

  ngOnInit(): void {
    this.producto = this._editproducto;
    this.user = JSON.parse(localStorage.getItem('usuario'));
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
  if(this._accion != 'Codigo de Barras'){
    if(this.producto.existencia?.length > 0){
    if(this._accion == 'Agregar'){
      this.guardarArticulo();
    }else{
      this.actualizarArticulo();
    }

  }
}
else{
  console.log("print etiquetas")
  this.submitted = false;
  this.variablesGL.showDialog.next(false);

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


  // this.tallasService.getTallas().subscribe(response => {
  //   if(response.exito){
  //     for(let talla of response.respuesta){
  //       this.listTallas.push(talla)
  //     }
  //   }
  // }, err => {

  // });


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
  })
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

  printCodeBars(){
    this.toastr.success("Impresion de etiquetas:"+this._editproducto.sku+"Cantidad:"+this.noEtiquetasPrint, 'Exito!!');
    this.articuloService.getImprimirEtiquetas(this._editproducto.descripcion,this._editproducto.sku,this.noEtiquetasPrint,this.user.pc).subscribe(response => {
    // this._editproducto.sku=""
    // this.noEtiquetasPrint=0
    this.toastr.success("Impresion de etiquetas:"+this._editproducto.sku+"Cantidad:"+this.noEtiquetasPrint, 'Exito!!');
    }, err => {
      console.log("Error:"+JSON.stringify(err));
      this.toastr.error('Hubo un problema al conectar con los servicios de Impresion','Ups!!');
    });

  }

}
