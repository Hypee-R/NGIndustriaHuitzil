import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { imagen64 } from '../../inventario/inventario.component';

@Component({
  selector: 'app-select-inventario',
  templateUrl: './select-inventario.component.html',
  styleUrls: ['./select-inventario.component.css']
})
export class SelectInventarioComponent implements OnInit {
  @Input() articleSelected: productoModel;
  @Output() onChangeArticle: EventEmitter<productoModel> = new EventEmitter<productoModel>();

  statusPantalla: number;
  loading: boolean = false;
  listArticulos: productoModel[] = [];
  imagenes:imagen64[]=[]

  accion = '';
  rows = 0;
  cols: any[] = [];
  constructor(
    public variablesGL: VariablesService,
    private inventarioService: InventarioService,
  ) {
    this.cols = [
      { fiel:'',header:'Imagen'},
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'existencia', header: 'Existencia' },
      { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
      { field: 'precio',header:'precio'},

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
  ngOnInit() {
      this.getArticulos();
  }

  getArticulos(){
    this.loading = true;
    this.inventarioService.getArticulos().subscribe(response => {
      if(response.exito){
        this.listArticulos = response.respuesta;
        this.listArticulos = this.listArticulos.filter(x => x.idArticulo != this.articleSelected.idArticulo);
        this.loading = false;
        for(let art of this.listArticulos){
          this.imagenes.push({id:art.idArticulo,imagen64c:art.imagen})
        }
      }
    }, err => {
      this.loading = false;
    });
  }

  changeArticulo(articulo: productoModel){
    this.onChangeArticle.emit(articulo);
  }

}
