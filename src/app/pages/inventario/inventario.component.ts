import { Component, OnInit, ViewChild } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { TallasService } from 'src/app/services/tallas.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';


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
  //variables de filtros

  tallaOptions: any[] = [];
  categoriaOptions: any[] = [];
  ubicacionOptions: any[] = [];

   // Modelo de filtros
   filterModel = {
    sku: '',
    descripcion: '',
    talla: null, // Aquí será el id de la talla seleccionada
    categoria: null, // Aquí será el id de la categoría seleccionada
    ubicacion: this.variablesGL.getSucursal()
  };
    // Modelo de filtros
  public csvRecords: any[] = [];
  accion = '';
  rows = 0;
  cols: any[] = [];
  constructor(
    public variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private toastr: ToastrService,
    private articuloService: InventarioService,
    private tallasService: TallasService,
    private categoriasService: CategoriasService,
    private UbicacionesService: UbicacionesService,

  ) {

    this.cols = [
      { field: '', header: 'Imagen' },
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'existencia', header: 'Existencia' },
      { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
      // { field: 'precio', header: 'precio' },
      { field: '', header: 'Etiqueta'}

    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
console.info("STATUS->",status)
console.info("STATUS pantalla->",this.statusPantalla)
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 6;
    }else if(status == 'laptop'){
      this.rows = 6;
    }else{
      this.rows = 11;
    }

  }
  ngOnInit() {

    this.getArticulos();
       this.getUbicaciones();
      this.getCategorias();
      this.getTallas();

  }
  //Impresion
  imprimir(articulo : productoModel){
    console.log(articulo)
    /*this.inventarioService.getImprimirEtiquetas(articulo).subscribe(response => {
    console.log(response);
    }, err => {
      console.log("Error:"+err);
    });*/
    alert("Impresion de etiquetas")
  }


  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }


  getArticulos() {
    this.getFilteredResults();
    // this.loading = true;
    // this.inventarioService.getArticulos().subscribe(response => {
    //   if (response.exito) {
    //     //console.log(response.respuesta)
    //     this.listArticulos = response.respuesta;
    //     this.loading = false;
    //     for (let art of this.listArticulos) {
    //       this.imagenes.push({ id: art.idArticulo, imagen64c: art.imagen })
    //     }
    //   }
    // }, err => {
    //   this.loading = false;
    // });
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
    //console.log(producto)
    producto.fechaIngreso= this.formatDate(producto.fechaIngreso);
    this.accion = 'Actualizar';

    this.selectedArticulo = { ...producto };
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }
  formatDate(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2); // agregar cero si el mes es de un dígito
    const day = ('0' + fecha.getDate()).slice(-2); // agregar cero si el día es de un dígito
    return `${year}-${month}-${day}`;
  }

  viewCodebar(producto : productoModel){
    this.accion = 'Codigo de Barras'
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
    status: row.status,
    existencia: row.existencia,
    descripcion: row.descripcion,
    fecha_ingreso: row.fechaIngreso,
    id_ubicacion: row.idUbicacion,
    id_categoria: row.idCategoria,
    id_talla: row.idTalla,
    imagen: "",
    sku: row.sku,
    precio: row.precio,
  })), { header: ['id_articulo','status','existencia','descripcion','fecha_ingreso','id_ubicacion','id_categoria','id_talla','imagen','sku','precio'] })
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
        csvRecord.status = data[1].trim();
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
    const recorreArray = (arr) => {
      for (let i = 0; i <= arr.length - 1; i++) {


        this.productoFile.idArticulo= arr[i].idArticulo,
        this.productoFile.status= arr[i].status,
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
       if(this.productoFile.sku!==""){
        this.articuloService.agregaArticulo( this.productoFile).subscribe(response => {
          if (response.exito) {
            this.getArticulos();
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
}

recorreArray(data);

this.toastr.success('Registro Guardado  con exito!!', 'Exito');

this.getArticulos()

  }

  filterByDropdown(field: string, value: any) {
    this.filterByField(field, value);
  }

  filterByField(field: string, value: string) {
    // Actualiza el valor del filtro correspondiente


    // Llama al método para obtener los resultados filtrados
    console.log(field,value)
    this.getFilteredResults();
  }

  getFilteredResults() {
    console.log('getFilteredResults llamado');

    const filters = {
      queryString: '',
     // sucursal: this.variablesGL.getSucursal(),
      // sku: this.filterModel.sku ? this.filterModel.sku.trim() : '',
      // descripcion: this.filterModel.descripcion ? this.filterModel.descripcion.trim() : '',
      talla: this.filterModel.talla ? this.filterModel.talla : null,
      categoria: this.filterModel.categoria ? this.filterModel.categoria : null,
      ubicacion: this.filterModel.ubicacion ? this.filterModel.ubicacion : null,
      page: 0,
      size: 1000
    };

    this.variablesGL.showLoading();
    this.inventarioService.searchProductDemanda(filters).subscribe(response => {
      if (response.exito) {
        this.listArticulos = response.respuesta;
        this.loading = false;
        for (let art of this.listArticulos) {
          this.imagenes.push({ id: art.idArticulo, imagen64c: art.imagen })
        }
       // this.articles = response.respuesta;
       // console.log('resultados filtrados: ', this.articles);
        this.variablesGL.hideLoading();
      } else {
       this.variablesGL.hideLoading();
        this.toastr.error(response.mensaje, 'Error!');
      }
    }, err => {
     // this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al buscar los productos', 'Error!');
      console.log(err);
    });
  }

   getUbicaciones() {
    this.loading = true;
    this.UbicacionesService.getUbicaciones().subscribe(response => {
      if (response.exito) {
        this.listUbicaciones = response.respuesta;

        this.ubicacionOptions = this.listUbicaciones.map(ubicacion => ({
          label: ubicacion.direccion,
          value: ubicacion.direccion
        }));
        console.log(this.ubicacionOptions);
        this.loading = false;
      } else {
        this.loading = false;

      }
    }, err => {
      this.loading = false;

    });
  }

  getCategorias() {
    this.loading = true;
    this.categoriasService.getCategorias().subscribe(response => {
      if (response.exito) {
        this.listCategorias = response.respuesta;

        this.categoriaOptions = this.listCategorias.map(categoria => ({
          label: categoria.descripcion,
          value: categoria.idCategoria
        }));
        console.log(this.categoriaOptions);
        this.loading = false;
      } else {
        this.loading = false;

      }
    }, err => {
      this.loading = false;

    });
  }
  getTallas() {
    this.loading = true;
    this.tallasService.getTallas().subscribe(response => {
      if (response.exito) {
        this.listTallas = response.respuesta;

        this.tallaOptions = this.listTallas.map(talla => ({
          label: talla.nombre,
          value: talla.idTalla
        }));
        console.log(this.tallaOptions);
        this.loading = false;
      } else {
        this.loading = false;

      }
    }, err => {
      this.loading = false;

    });
  }


}



export class CSVRecord {

  public idArticulo: any;
  public status: string;
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
