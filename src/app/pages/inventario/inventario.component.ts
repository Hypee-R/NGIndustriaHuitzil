import { Component, OnInit, ViewChild } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model';

import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoriasService } from 'src/app/services/categorias.service';
import { TallasService } from 'src/app/services/tallas.service';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { CategoriaModel } from 'src/app/models/categoria.model';

export interface imagen64 {
  id: number,
  imagen64c: string
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit {
  productDialog: boolean;
  products: any;
  product: any;
  selectedProducts: any;
  submitted: boolean;
  statusPantalla: number;
  loading: boolean = false;
  listArticulos: productoModel[] = [];
  listTallas: CatTallaModel[] = [];
  listUbicaciones: UbicacionModel[] = [];
  listCategorias: CategoriaModel[] = [];
  selectedArticulo: productoModel = new productoModel();
  selectedArticulos: productoModel[];
  imagenes: imagen64[] = []
  public csvRecords: any[] = [];
  accion = '';
  rows = 0;
  cols: any[] = [];
  /* constructor( private messageService: MessageService, private confirmationService: ConfirmationService) { }*/
  constructor(
    public variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private toastr: ToastrService,
    private articuloService: InventarioService,

  ) {


    this.cols = [
      // { field: 'idArticulo', header: 'ID' },
      { fiel: '', header: 'Imagen' },
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'existencia', header: 'Existencia' },
      // { field: 'fechaIngreso', header: 'Fecha Ingreso' },
      // { field:'categoria',header:'Categoria'},
      // { field: 'unidad', header: 'Unidad' },
      { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
      { field: 'precio', header: 'precio' },

    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 7;
    }else{
      this.rows = 7;
    }
  
  }
  ngOnInit() {
    this.getArticulos();

  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }


  getArticulos() {
    this.loading = true;
    this.inventarioService.getArticulos().subscribe(response => {
      if (response.exito) {
        this.listArticulos = response.respuesta;
        console.log('articulos ', this.listArticulos);
        this.loading = false;
        for (let art of this.listArticulos) {
          this.imagenes.push({ id: art.idArticulo, imagen64c: art.imagen })
        }
      }
    }, err => {
      this.loading = false;
    });
  }

  editProduct() {
    this.product = {};
    this.productDialog = true;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  ////Agregar nuevo componete

  openModalAdd() {
    this.accion = 'Agregar';
    this.selectedArticulo = new productoModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  /// Editar componetente
  editArticulo(producto: productoModel) {
    console.log(producto)
    this.accion = 'Actualizar';
    this.selectedArticulo = { ...producto };
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  ///Eliminar componetne

  deleteArticulo(articulo: productoModel) {
    console.log(articulo)
    console.log(articulo.descripcion)
    Swal.fire({
      title: `Está seguro de eliminar el proveedor ${articulo.descripcion}?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(proveedor);

        this.inventarioService.eliminaArticulo(articulo).subscribe(response => {
          if (response.exito) {
            this.toastr.success(response.mensaje, 'Exito!!');
            this.getArticulos();
          } else {
            this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          //console.log('error elimina proveedor ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea', 'Ups!!');
        });
      } else if (result.isDenied) {

      }
    });
  }
  Excel() {
   
   let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listArticulos.map(row => ({
    id_articulo: row.idArticulo ,
    unidad: row.unidad,
    existencia: row.existencia,
    descripcion: row.descripcion,
    fecha_ingreso: row.fechaIngreso,
    id_ubicacion: row.idUbicacion,
    id_categoria: row.idCategoria,
    id_talla: row.idTalla,
    imagen: "",
    sku: row.sku,
    precio: row.precio,
  })), { header: ['id_articulo','unidad','existencia','descripcion','fecha_ingreso','id_ubicacion','id_categoria','id_talla','imagen','sku','precio'] })
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'InventarioProductos');
   XLSX.writeFile(wb, 'Inventario'+new Date().toISOString()+'.csv')
   return this.toastr.success('Exportado con exito!!', 'Exito');
  }

  //Carga con Excel
  @ViewChild('fileImportInput') fileImportInput: any;
  fileChangeListener($event: any): void {


    console.log("Recorremos el archivo")
    let text = [];
    let files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.savedatafile(this.csvRecords);



      };

      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);

      };

    } else {

      this.toastr.warning('Por favor importe un archivo .csv Valido!');

      this.fileReset();
    }
  }
   ConvertStringToNumber(input: string) { 
    if (input.trim().length==0) { 
        return NaN;
    }
    return Number(input);
}

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let dataArr = [];
    console.log(csvRecordsArray.length)
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = (<string>csvRecordsArray[i]).split(',');
      console.log(data.length)
      if (data.length == headerLength) {

        let csvRecord: CSVRecord = new CSVRecord();

        csvRecord.idArticulo = data[0].trim();
        csvRecord.unidad = data[1].trim();
        csvRecord.existencia = data[2].trim();
        csvRecord.descripcion = data[3].trim();
        csvRecord.fechaIngreso = data[4].trim();
        csvRecord.idUbicacion = data[5].trim();
        csvRecord.idCategoria = data[6].trim();
        csvRecord.idTalla = data[7].trim();
        csvRecord.imagen = data[8].trim();
        csvRecord.sku = data[9].trim();
        csvRecord.precio = data[10].trim();


        dataArr.push(csvRecord);
      }
    }



    return dataArr;
  }

  productoFile: productoModel = new productoModel();
  savedatafile(data) {
    console.log("save data field")
    console.log(data)
    const recorreArray = (arr) => {
      for (let i = 0; i <= arr.length - 1; i++) {
        console.log(arr[i]);

        this.productoFile.idArticulo= 0,
        this.productoFile.unidad= arr[i].unidad,
        this.productoFile.existencia= arr[i].existencia,
        this.productoFile.descripcion=arr[i].descripcion,
        this.productoFile.fechaIngreso=arr[i].fechaIngreso,
        this.productoFile. idUbicacion=  parseInt( arr[i].idUbicacion),
        this.productoFile. idCategoria= parseInt(  arr[i].idCategoria),
        this.productoFile.  idTalla= parseInt(  arr[i].idTalla),
        this.productoFile.  talla= "",
        this.productoFile. ubicacion="",
        this.productoFile.  categoria="",
        this.productoFile.  imagen= arr[i].imagen,
        this.productoFile.  precio= arr[i].precio,
        this.productoFile. sku=arr[i].sku,

          
         
      console.log(this.productoFile)

        this.articuloService.agregaArticulo( this.productoFile).subscribe(response => {
          if (response.exito) {
           // this.toastr.success(response.mensaje, 'Exito!!');
           // this.hideDialog();
            //setTimeout(() => {
              //this.saveProducto.emit(true);
            //}, 100);
          } else {
            this.toastr.error(response.mensaje, 'Ups!!');
          }
        }, err => {
          console.log('error add proveedor ', err);
          this.toastr.error('Hubo un problema al conectar con los servicios en linea', 'Ups!!');
        });




  }
}

recorreArray(data);

this.toastr.success('Registro Guardado  con exito!!', 'Exito');

this.getArticulos() 

  }

}



export class CSVRecord {

  public idArticulo: any;
  public unidad: string;
  public existencia: string;
  public descripcion: string;
  public fechaIngreso: string;
  public idUbicacion: any;
  public idCategoria: any;
  public idTalla: any;
  public talla:string;
   public ubicacion:string;
  public categoria:string;
  public imagen: string;
  public sku: string;
  public precio: any;



  constructor(

  ) {

  }



}
