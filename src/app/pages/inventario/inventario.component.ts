import { Component, OnInit, ViewChild } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
// import { CatTallaModel } from 'src/app/models/tallas.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { TallasService } from 'src/app/services/tallas.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { UBICACION_MERMA } from 'src/app/constants';


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
  // listTallas: CatTallaModel[] = [];
  listUbicaciones: UbicacionModel[] = [];
  listCategorias: CategoriaModel[] = [];
  selectedArticulo: productoModel = new productoModel();
  selectedArticuloMerma: productoModel = new productoModel();
  selectedArticuloRebanadas: productoModel = new productoModel();
  selectedArticulos: productoModel[];
  imagenes: imagen64[] = []
  showMermaDialog = false;
  showRebanadasDialog = false;
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
    ubicacion: (this.variablesGL.getRol() === 'Administrador' || this.variablesGL.getRol() === 'Gestion')
      ? null
      : this.variablesGL.getSucursal()
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
      
      // { field: 'talla', header: 'Talla' },
      { field: 'ubicacion', header: 'Ubicacion' },
      // { field: 'precio', header: 'precio' },
      { field: '', header: 'Etiqueta'},
      { field: '', header: 'Merma'}
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
      // this.getTallas();

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

   showMerma(producto : productoModel){
    this.selectedArticuloMerma = { ...producto };
    this.showMermaDialog = true;
  }

  crearRebanadas(articulo: productoModel) {
    this.selectedArticuloRebanadas = { ...articulo };
    this.showRebanadasDialog = true;
  }

  closeRebanadasDialog(): void {
    this.showRebanadasDialog = false;
    this.selectedArticuloRebanadas = new productoModel();
  }

  confirmarCrearRebanadas(event: { costoRebanada: number; descripcionRebanada: string }): void {
    const existenciaActual = Number(this.selectedArticuloRebanadas?.existencia ?? 0);

    if (existenciaActual < 1) {
      this.toastr.warning('No hay existencia disponible para crear rebanadas.', 'Validacion');
      return;
    }

    const costoRebanada = Number(event?.costoRebanada ?? 0);
    if (!costoRebanada || costoRebanada <= 0) {
      this.toastr.warning('Ingresa un costo por rebanada valido.', 'Validacion');
      return;
    }

    //const nuevoSkuRebanadas = this.selectedArticuloRebanadas.sku;
    const articuloRebanadas = { ...this.selectedArticuloRebanadas };
    articuloRebanadas.idArticulo = 0;
    articuloRebanadas.sku = this.selectedArticuloRebanadas.sku + '-RB';
    articuloRebanadas.descripcion = articuloRebanadas.descripcion + ' - REBANADAS';
    articuloRebanadas.existencia = '8';

    const articuloOrigen = { ...this.selectedArticuloRebanadas };
    articuloOrigen.existencia = String(existenciaActual - 1);

    this.articuloService.agregaArticulo(articuloRebanadas).subscribe(addResponse => {
      if (!addResponse.exito) {
        this.toastr.error(addResponse.mensaje || 'No se pudo crear el articulo por rebanadas', 'Ups!!');
        return;
      }

      this.articuloService.actualizaArticulo(articuloOrigen).subscribe(updateResponse => {
        if (updateResponse.exito) {
          this.toastr.success('Articulo por rebanadas creado correctamente', 'Exito!!');
          this.closeRebanadasDialog();
          this.getArticulos();
        } else {
          this.toastr.warning(updateResponse.mensaje || 'Se creo el SKU de rebanadas, pero no se actualizo el stock origen', 'Atencion');
          this.getArticulos();
        }
      }, () => {
        this.toastr.warning('Se creo el SKU de rebanadas, pero hubo un problema al actualizar el stock origen', 'Atencion');
        this.getArticulos();
      });
    }, () => {
      this.toastr.error('Hubo un problema al crear el articulo por rebanadas', 'Ups!!');
    });
  }

  closeMermaDialog(): void {
    this.showMermaDialog = false;
    this.selectedArticuloMerma = new productoModel();
  }

  isMermaSelected(): boolean {
    const selectedUbicacion = this.filterModel?.ubicacion;
    if (!selectedUbicacion) {
      return false;
    }

    const ubicacionEncontrada = this.listUbicaciones.find(
      ubicacion => ubicacion.direccion === selectedUbicacion
    );

    if (ubicacionEncontrada?.idUbicacion === UBICACION_MERMA) {
      return true;
    }

    return String(selectedUbicacion).trim().toUpperCase() === 'MERMA';
  }

  enviarAMerma(event: { cantidad: number; motivo: string }): void {
    const cantidad = Number(event?.cantidad ?? 0);
    const existenciaActual = Number(this.selectedArticuloMerma?.existencia ?? 0);

    if (!cantidad || cantidad < 1 || cantidad > existenciaActual) {
      this.toastr.warning('La cantidad a enviar a merma no es valida.', 'Validacion');
      return;
    }

    const articuloMerma = { ...this.selectedArticuloMerma };
    articuloMerma.idArticulo = 0;
    articuloMerma.status = 'MERMA';
    articuloMerma.idUbicacion = UBICACION_MERMA;
    articuloMerma.ubicacion = 'MERMA';
    articuloMerma.existencia = cantidad.toString();
    articuloMerma.motivoMerma = event?.motivo || '';

    const articuloOrigen = { ...this.selectedArticuloMerma };
    articuloOrigen.existencia = (existenciaActual - cantidad).toString();

    this.articuloService.agregaArticulo(articuloMerma).subscribe(addResponse => {
      if (!addResponse.exito) {
        this.toastr.error(addResponse.mensaje || 'No se pudo registrar el articulo en merma', 'Ups!!');
        return;
      }

      this.articuloService.actualizaArticulo(articuloOrigen).subscribe(updateResponse => {
        if (updateResponse.exito) {
          this.toastr.success('Merma registrada como articulo nuevo', 'Exito!!');
          this.closeMermaDialog();
          this.getArticulos();
        } else {
          this.toastr.warning(updateResponse.mensaje || 'Se creo la merma, pero no se actualizo el stock origen', 'Atencion');
          this.getArticulos();
        }
      }, () => {
        this.toastr.warning('Se creo la merma, pero hubo un problema al actualizar el stock origen', 'Atencion');
        this.getArticulos();
      });
    }, () => {
      this.toastr.error('Hubo un problema al registrar el articulo en merma', 'Ups!!');
    });
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
    // id_talla: row.idTalla,
    imagen: "",
    sku: row.sku,
    precio: row.precio,
  })), { header: ['id_articulo','status','existencia','descripcion','fecha_ingreso','id_ubicacion','id_categoria',,'imagen','sku','precio'] })
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
        // csvRecord.idTalla = data[7].trim();
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
        // this.productoFile.  idTalla= parseInt(  arr[i].idTalla),
        // this.productoFile.  talla= "",
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
      // talla: this.filterModel.talla ? this.filterModel.talla : null,
      categoria: this.filterModel.categoria ? this.filterModel.categoria : null,
      ubicacion: this.filterModel.ubicacion ? this.filterModel.ubicacion : null,
      page: 0,
      size: 1000
    };

    this.variablesGL.showLoading();
    this.inventarioService.searchProductDemanda(filters).subscribe(response => {
      if (response.exito) {
        this.listArticulos = response.respuesta;
        console.log('Articulos obtenidos: ', this.listArticulos);
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


  sumarExistencia(articulo: productoModel): void {

    const existenciaNumerica = parseInt(articulo.existencia, 10) || 0;
    articulo.existencia = (existenciaNumerica + 1).toString();
   

   this.actualizarArticulo(articulo); 
  }
  
  restarExistencia(articulo: productoModel): void {
    const existenciaNumerica = parseInt(articulo.existencia, 10) || 0;
    if (existenciaNumerica > 0) {
      articulo.existencia = (existenciaNumerica - 1).toString();
       this.actualizarArticulo(articulo);
    }
  }

  actualizarArticulo(articulo: productoModel){
    
    this.articuloService.actualizaArticulo(articulo).subscribe(response => {
      if(response.exito){
          this.toastr.success("Se modifico el Stock", 'Exito!!');
        
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza proveedor ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
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
  public ubicacion:string;
  public categoria:string;
  public imagen: string;
  public sku: string;
  public precio: any;



  constructor(

  ) {

  }


}
