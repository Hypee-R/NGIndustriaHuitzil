import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from '../../../services/ventas.service';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-open-productos',
  templateUrl: './open-productos.component.html',
  styleUrls: ['./open-productos.component.css']
})
export class OpenProductosComponent implements OnInit {

    @Input() _accion: string;
    @Input() _articles: productoModel[];
    @Input() _articlesSelected: productoModel[];
    @Input() _nArticles : number;
    @Output() _articulosS = new EventEmitter<productoModel>();  
    loading: boolean = false;
    rows = 0;
    accion = '';
    submitted = false;
    visibleDialog = true;
    queryString: string = '';
    articlesSelected: productoModel[] = [];
    articles: productoModel[] = [];
    colsProducts:any[] = [];
    dialogSubscription: Subscription = new Subscription();
    articlesAddSales = 0
    constructor(
      private toastr: ToastrService,
      private variablesGL: VariablesService,
      private ventasService: VentasService,
      private inventarioService: InventarioService,
    ) {
      this.colsProducts = [
        { field: 'sku', header: 'SKU' },
        { field: 'descripcion',header:'Producto'},
        { field: 'talla',header: 'Talla'},
        { field: 'precio',header:'Precio'},
        { field: 'existencia',header:'Existencia'}
        
      ];
      this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
  
        if(this.visibleDialog){
          if(this._accion){
            this.accion = this._accion;
          }
          
          this.articles = this._articles
          this.articlesSelected = this._articlesSelected
         this.articlesAddSales = this._nArticles
        }
      });
  
      let status = this.variablesGL.getPantalla();
      if(status == 'celular'){
        this.rows = 4;
      }else if(status == 'tablet'){
        this.rows = 4;
      }else if(status == 'laptop'){
        this.rows = 6;
      }else{
        this.rows = 11;
      }
    }
  
    ngOnInit(): void {
        
      
    }
  
    ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
        this.articlesSelected=[]
      }
      
    }
  
    hideDialog() {
      this.submitted = false;
      this.articlesSelected = []
      this.variablesGL.showDialog.next(false);
    }

  getResults(){
    if(this.queryString && this.queryString.trim().length > 0){
      this.variablesGL.showLoading();
      this.inventarioService.searchProduct(this.queryString).subscribe(response => {
        if(response.exito){
          this.variablesGL.hideLoading();

          this.toastr.success(response.mensaje, 'Exito!!!');
          this.articles = response.respuesta;
          console.log('resultados de la busqueda: ', this.articles);
        }else{
          this.variablesGL.hideLoading();
          this.toastr.error(response.mensaje, 'Error!');
        }
      }, err => {
        this.variablesGL.hideLoading();
        this.toastr.error('Hubo un error al buscar los productos', 'Error!');
      });
    }else{
      this.toastr.error('Ingrese un elemento de busqueda', 'Atención!');
    }
  }

  addProduct(product: productoModel){
    this.articlesAddSales += 1
    this._articulosS.emit(product)
  }

  closeModal(){
 
    this.variablesGL.showDialog.next(false);
  
  }

  reduceList(){
    this.articlesSelected = this.articlesSelected.reduce((acc,item)=>{
      if(!acc.includes(item)){
      	acc.push(item);
      }
      return acc;
    },[])
  }
                 
}
