import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ArticulosProduccionModel } from 'src/app/models/articulosProduccion.model';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { MaterialesModel } from 'src/app/models/materiales.model';
import { CatProduccionCorteModel } from 'src/app/models/produccionCorte';
import { productoModel } from 'src/app/models/productos.model';
import { CategoriasService } from 'src/app/services/categorias.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { ProduccionService } from 'src/app/services/produccion.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-produccion-corte',
  templateUrl: './add-produccion-corte.component.html',
  styleUrls: ['./add-produccion-corte.component.css']
})
export class AddProduccionCorteComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @Input() _accion: string;
  @Input() _editCorte: CatProduccionCorteModel;
  @Output() saveProduccion: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() _articles: any[];
  @Input() _articulosProduccion: ArticulosProduccionModel[];
  @Input() _materialesProduccion: MaterialesModel[];
  submitted = false;
  visibleDialog: boolean;
  loadingTabla: boolean = false;
  loadingTablaMateriales: boolean = false;
  accion = '';
  articles: ArticulosProduccionModel[] = [];
  corte: CatProduccionCorteModel = new CatProduccionCorteModel();
  listStatus: String[] = ["SIN INICIAR", "EN PROCESO", "TERMINADO"];
  dialogSubscription: Subscription = new Subscription();
  listCategorias: CategoriaModel[] = [];
  categoriaSeleccionada: any;
  statusOrder: string = '';
  colsProducts = [
    { field: 'sku', header: 'SKU' },
    { field: 'descripcion', header: 'Descripcion' },
  ];

  colsProductsSelected = [
    { field: 'sku', header: 'SKU' },
    { field: 'descripcion', header: 'Descripcion' },
    { field: 'existencia', header: 'Cantidad' },
  ];
  cols = [
    { field: 'nombre', header: 'Nombre' },
    { field: 'tipoMedicion', header: 'Tipo Medición' },
    { field: 'status', header: 'Tipo Medición' },
  ];

  colsProductsSelectedM = [
    { field: 'nombre', header: 'Nombre' },
    { field: 'tipoMedicion', header: 'Tipo Medición' },
    { field: 'stock', header: 'Cantidad' },
  ];
  cantidadTotal: number = 0;
  cantidadTotalM: number = 0;
  articlesSelected: productoModel[] = [];
  materialSelected: MaterialesModel[] = [];
  loading: boolean = false;
   listMateriales: MaterialesModel[] = [];
  constructor(
    private toastr: ToastrService,
    private produccionCorte: ProduccionService,
    private inventarioService: InventarioService,
    private categoriesService: CategoriasService,
    private variablesGL: VariablesService,
    private materialesService: MaterialesService,
  ) {
    
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
        this.visibleDialog = estado;
        this.accion = this._accion;
        this.cantidadTotal = 0;
        if(this._editCorte){
          this.corte = this._editCorte;
          
        }
        if(this._accion){
         
          if(this.accion == 'Actualizar'){
            this.statusOrder = this._editCorte.status;
            this.articlesSelected = this._articulosProduccion;
            this.materialSelected=this._materialesProduccion;
            this.articlesSelected.forEach((art) => {
              this.cantidadTotal += Number(art.existencia);
             }
            )
          }
          else{
            this.categoriaSeleccionada = undefined;
            this.articles = [];
            this.articlesSelected = [];
            this.cantidadTotal = 0;
    
            this.listMateriales = [];
            this.materialSelected= [];
            this.cantidadTotalM=0;

          }
        }
    });
  }

  ngOnInit(): void {
  this.getMateriales();
  this.getCategorias();  
  }

  ngOnDestroy(): void {
      if(this.dialogSubscription){
        this.dialogSubscription.unsubscribe();
      }
  }

  hideDialog() {
    this.submitted = false;
    this.corte = new CatProduccionCorteModel();
    this.variablesGL.showDialog.next(false);
  }

  saveDataProduccion(){
    this.submitted = true;
    if(this.corte.folio?.length > 0 && this.corte.folio?.length > 2){
      console.log(this._accion)
      if(this._accion == 'Agregar'){
        this.guardarProduccion();
      }else{
        this.validaStatus()
        ///this.actualizarProduccion();
      }
    }
  }

  guardarProduccion(){
   // console.log(this.articlesSelected)
    if(this.articlesSelected.length == 0){
      this.toastr.error('Agrega al menos un articulo', 'Atención!');
      return;
    }
    this.corte.fechaInicio = new Date().toISOString();
    this.articlesSelected.forEach((art) => {
      art.idArticulo = 0;
      art.fechaIngreso = new Date().toISOString();

    })

    
    this.corte.articulos = this.articlesSelected;
    this.corte.materiales=this.materialSelected;

     console.info('Produccion Save-->',this.corte)
    this.produccionCorte.agregaProduccionCorte(this.corte).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          this.generatePDFOrdenProduccion(this.corte); 
          setTimeout(() => {
            this.saveProduccion.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error add categoria ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    })
  }

  getCategorias() {
    this.listCategorias = [];
    this.categoriesService.getCategorias().subscribe(
      (response) => {
        if (response.exito) {

         // this.listCategorias.push(new CategoriaModel());
          for (let categoria of response.respuesta) {
            this.listCategorias.push(categoria);
           // this.loading=false
          }
        }
      },
      (err) => {}
    );
  }

  validaStatus(){
    if(this.corte.status =="FINALIZADO"){
       Swal.fire({
             title: `Desea finalizar la orden?`,
             icon: 'question',
             showDenyButton: true,
             confirmButtonText: 'Aceptar',
             denyButtonText: `Cancelar`,
           }).then((result) => {
             if (result.isConfirmed) {
              this.actualizarProduccion();
              this.updateProduccion();
              console.log('actualiza produccion');
             }})
      return
    }
    this.updateProduccion()
  }


  actualizarProduccion(){ 
    this.produccionCorte.actualizaArticulosProduccionCorte(this.corte).subscribe(response => {
      if(response.exito){
          /*this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveProduccion.emit(true);
          }, 100);*/
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      ///console.log('error actualiza categoria ', err);
      //this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  updateProduccion(){

    this.produccionCorte.actualizaProduccionCorte(this.corte).subscribe(response => {
      if(response.exito){
          this.toastr.success(response.mensaje, 'Exito!!');
          this.hideDialog();
          setTimeout(() => {
            this.saveProduccion.emit(true);
          }, 100);
      }else{
          this.toastr.error(response.mensaje, 'Ups!!');
      }
    }, err => {
      console.log('error actualiza categoria ', err);
      this.toastr.error('Hubo un problema al conectar con los servicios en linea','Ups!!');
    });
  }

  filterstable(categoria: any) {
    this.toastr.warning("Se consultaran los articulos" ,'Espera!!');
    this.categoriaSeleccionada = categoria;
    this.loadingTabla = true; 
  
    if (categoria != null) {
      this.inventarioService.getSubCategoriasByCategoria(categoria.idCategoria)
        .subscribe(
          (response) => {
            if (response.exito) {
              this.articles = response.respuesta;
            }
            this.loadingTabla = false; 
          },
          (err) => {
            this.loadingTabla = false; 
          }
        );
    } else {
      this.loadingTabla = false; 
    }
  }
  


  addProduct(product: productoModel) {
      let registerObjeto = this.articlesSelected.find(
        (a) =>
          a.idArticulo === product.idArticulo 
      );

    
    if (registerObjeto) {
      let indice = this.articlesSelected.findIndex(
        (b) =>
          b.idArticulo == registerObjeto.idArticulo 
      );
      
      var cantidad =  Number(this.articlesSelected[indice].existencia) +1 ;
      this.articlesSelected[indice].existencia = cantidad.toString();
    }

    else{

      product.existencia = "1";
      this.articlesSelected.push(product);
      
    }
    this.cantidadTotal += 1;
  
  }


  addMaterial(material: MaterialesModel) {
    let registerObjeto = this.materialSelected.find(
      (a) =>
        a.idMaterial === material.idMaterial 
    );

  
  if (registerObjeto) {
    let indice = this.materialSelected.findIndex(
      (b) =>
        b.idMaterial == registerObjeto.idMaterial 
    );
    
    var cantidad =  Number(this.materialSelected[indice].stock) +1 ;
    this.materialSelected[indice].stock = cantidad.toString();
  }

  else{

    material.stock = "1";
    this.materialSelected.push(material);
    
  }
  this.cantidadTotalM += 1;

}

  removeProduct(product: productoModel) {
    let indice = this.articlesSelected.findIndex(
      (b) =>
        b.idArticulo == product.idArticulo 
    );
    if (indice != -1) {
      this.articlesSelected.splice(indice, 1);
      this.cantidadTotal -= Number(product.existencia);
    }
    this.cantidadTotal = 0;
    this.articlesSelected.forEach((art) => {
      this.cantidadTotal += Number(art.existencia);
    })
  }

  
  removeProductM(product: MaterialesModel) {
    let indice = this.materialSelected.findIndex(
      (b) =>
        b.idMaterial == product.idMaterial 
    );
    if (indice != -1) {
      this.materialSelected.splice(indice, 1);
      this.cantidadTotal -= Number(product.stock);
    }
    this.cantidadTotal = 0;
    this.materialSelected.forEach((art) => {
      this.cantidadTotal += Number(art.stock);
    })
  }


  changeRowArticle(produccionCorte: productoModel) {

    console.log('cambio de articulo ', produccionCorte.existencia);
    let indice = this.articlesSelected.findIndex(
      (b) =>
        b.idArticulo == produccionCorte.idArticulo 
    );
    if(produccionCorte.existencia == null || produccionCorte.existencia == undefined || produccionCorte.existencia == ''){
      this.articlesSelected[indice].existencia = '1';
      this.toastr.info('Ingresa una cantidad valida', 'Atención!');
    }
    else{
      this.articlesSelected[indice].existencia = produccionCorte.existencia.toString();
    }
  
    this.cantidadTotal = 0;
    this.articlesSelected.forEach((art) => {
      this.cantidadTotal += Number(art.existencia);
    })
  }


  changeRowArticleM(produccionCorte: MaterialesModel) {

    console.log('cambio de articulo ', produccionCorte.stock);
    let indice = this.materialSelected.findIndex(
      (b) =>
        b.idMaterial == produccionCorte.idMaterial 
    );
    if(produccionCorte.stock == null || produccionCorte.stock == undefined || produccionCorte.stock == ''){
      this.materialSelected[indice].stock = '1';
      this.toastr.info('Ingresa una cantidad valida', 'Atención!');
    }
    else{
      this.materialSelected[indice].stock = produccionCorte.stock.toString();
    }
  
    this.cantidadTotal = 0;
    this.materialSelected.forEach((art) => {
      this.cantidadTotal += Number(art.stock);
    })
  }


  getMateriales(){
    console.info("Consultar Materiales")
    this.loadingTablaMateriales = true; 
    this.materialesService.getMateriales().subscribe(response => {
      if(response.exito){
        console.log(response.respuesta);

        this.listMateriales = response.respuesta;
        this.loadingTablaMateriales = false; 
      }
    }, err => {
      this.loadingTablaMateriales = false; 
    });
}

generatePDFOrdenProduccion(corte: any): void {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text('Orden de Producción', 14, 15);

  // Información general
  doc.setFontSize(11);
  doc.text(`Folio: ${corte.folio}`, 14, 25);
  doc.text(`Responsable: ${corte.responsable}`, 14, 32);
  doc.text(`Fecha de Inicio: ${new Date(corte.fechaInicio).toLocaleString()}`, 14, 39);
  doc.text(`Status: ${corte.status}`, 14, 46);
  doc.text(`Comentarios: ${corte.comentarios}`, 14, 53);

  // Artículos
  const materialStartYx = (doc as any).lastAutoTable?.finalY || 60;
  if (corte.articulos?.length > 0) {
    
    doc.text('Articulos', 14, materialStartYx + 10);
    autoTable(doc, {
      head: [['SKU', 'Descripción', 'Precio', 'Producir', 'Status', 'Fecha Ingreso']],
      body: corte.articulos.map(a => [
        a.sku,
        a.descripcion,
        `$${a.precio}`,
        a.existencia,
        a.status,
        new Date(a.fechaIngreso).toLocaleDateString()
      ]),
      startY: 60,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],     // fondo negro
        textColor: [255, 255, 255] // texto blanco para contraste
      }
    });
  }

  // Materiales
  const materialStartY = (doc as any).lastAutoTable?.finalY || 60;

  if (corte.materiales?.length > 0) {
    doc.text('Materiales', 14, materialStartY + 10);
    autoTable(doc, {
      head: [['Nombre', 'Descripción', 'Medición', 'Precio', 'Se utilizo', 'Status']],
      body: corte.materiales.map(m => [
        m.nombre,
        m.descripcion,
        m.tipoMedicion,
        `$${m.precio}`,
        m.stock,
        m.status
      ]),
      startY: materialStartY + 15,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],     // fondo negro
        textColor: [255, 255, 255] // texto blanco para contraste
      }
    });

    // Proveedores y ubicaciones
    corte.materiales.forEach((m, index) => {
      const y = (doc as any).lastAutoTable?.finalY + 10 || 100;

      doc.text(`Proveedor del material "${m.nombre}"`, 14, y);
      m.proveedores?.forEach(p => {
        doc.setFontSize(10);
        doc.text(`Nombre: ${p.nombre}`, 14, y + 6);
        doc.text(`Correo: ${p.correo}`, 14, y + 12);
        doc.text(`Dirección: ${p.direccion}`, 14, y + 18);
      });

      // doc.setFontSize(11);
      // doc.text(`Ubicación de "${m.nombre}"`, 14, (doc as any).lastAutoTable?.finalY + 30);
      // m.ubicaciones?.forEach(u => {
      //   doc.setFontSize(10);
      //   doc.text(`Dirección: ${u.direccion}`, 14, (doc as any).lastAutoTable?.finalY + 36);
      //   doc.text(`Encargado: ${u.nombreEncargado} ${u.apellidoPEncargado}`, 14, (doc as any).lastAutoTable?.finalY + 42);
      // });
    });
  }

  // Guardar PDF
  doc.save(`${corte.folio}.pdf`);
}

}
