import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CajaModel } from 'src/app/models/caja.model';
import { productoModel } from 'src/app/models/productos.model';
import { productoVentaModel } from 'src/app/models/productoVenta.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { VentaModel } from 'src/app/models/venta.model';
import { VentaArticuloModel } from 'src/app/models/VentaArticulo.Model';
import { formatDate } from '@angular/common';
import ConectorPluginV3 from "src/app/ConectorPluginV3";
import { CatProveedorModel } from 'src/app/models/proveedores.model';
import { Console } from 'console';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})


export class VentasComponent implements OnInit {
  cadenaProductos: string = "\n";
  impresoras = [];
  impresoraSeleccionada: string = "TicketsZebraSistema";
  mensaje: string = "";

  display: boolean = false;
  displayCotizacion: boolean = false;
  @Output() _articulosS = new EventEmitter<productoModel>();
  statusPanubicacion: number;
  loading: boolean = false;
  queryString: string = '';
  queryStringClient: string = '';
  listVentas: productoVentaModel[] = [];
  articles: productoModel[] = [];
  articlesSelected: productoModel[] = []
  articlesShell: productoVentaModel[] = [];
 
  ventaArticulo: VentaArticuloModel[] = [];

  openCash: Boolean = false
  cols: any[] = [];
  rows = 0;
  accion = '';
  openProducts = '';
  articulos = 0
  total = 0
  totalLetra = "";
  totalMultiple = 0
  totalMultipleF = 0
  totalMultipleT = 0
  //Busqueda CLIENTES
  clienteName: string = '';
  resultsClientes:  CatProveedorModel[];
  selectedclienteNameAdvanced: CatProveedorModel;
  filteredClients: CatProveedorModel[];
  clientes: CatProveedorModel[];
  //Busqueda CLIENTES

  // Busqueda Productos
  //clienteName: string = '';
  resultsArticles:  productoModel[];
  selectedArticleNameAdvanced: productoModel;
  filteredArticle: productoModel[];
  articlesS: productoModel[];
   // Busqueda Productos


  cantidades: number[] = []
  RegistraVenta: VentaModel = new VentaModel();
  cashModel: CajaModel;
  CurrentDate = new Date();
  constructor(
    private toastr: ToastrService,
    private ventasService: VentasService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private proveedoresService: ProveedoresService,
  ) {

    this.cols = [
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'descripcion', header: 'Producto' },
      { field: 'precio', header: 'Precio' },
      // { field: 'talla', header: 'Talla' },
      { field: 'sku', header: 'SKU' }

    ];

    this.statusPanubicacion = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if (status == 'celular') {
      this.rows = 6;
    } else if (status == 'tablet') {
      this.rows = 7;
    } else if (status == 'laptop') {
      this.rows = 4;
    } else {
      this.rows = 7
    }

  }

  selectedValues: string[] = [];

  async ngOnInit() {
    this.loading = false
    this.getCaja();
   
    this.proveedoresService.getProveedores().subscribe(response => {
      if (response.exito) {
      // this.toastr.success("Se consultaron los clientes ", 'Exito!!!');
        this.clientes = response.respuesta;
      // console.log('resultados de la busqueda: ', JSON.stringify(  this.clientes ));
      } else {
        this.variablesGL.hideLoading();
       
        this.toastr.error(response.mensaje, 'Error!');
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al buscar cliente', 'Error!');
    });
  }



 
  getResultsClients(event) {
    console.log(event.query)
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.clientes.length; i++) {
      let country = this.clientes[i];
      if (country.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
  
    this.filteredClients = filtered;
    console.log(   this.filteredClients);
    this.clienteName=event.query;
    //this.selectedclienteNameAdvanced.nombre=event.query;
  }


  getResultsArticles(event) {
   
    let filtered: productoModel[] = [];
    let query = event.query;
    for (let i = 0; i < this.articlesS.length; i++) {
      let country = this.articlesS[i];
      if (country.sku.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    console.log(filtered)

    if(filtered.length!=0){
      let artc = new productoModel()
      artc.descripcion = filtered[0].descripcion
      artc.precio = filtered[0].precio
      artc.talla = filtered[0].talla
      artc.sku = filtered[0].sku
      artc.idArticulo = filtered[0].idArticulo
      artc.fechaIngreso = filtered[0].fechaIngreso
   this.addProductVenta(artc);
    }


    this.filteredArticle = filtered;
  }



  openProductsM() {
    this.variablesGL.showLoading();
    this.accion = ''
    this.openProducts = "Productos"
    this.articlesSelected = []
    this.getArticulos()
  }

  openCashRegister() {
    this.openProducts = ""
    this.accion = 'Abrir';
    this.getCaja();

  }

  closeCashRegister() {
    this.openProducts = ""
    this.accion = 'Cerrar';
    this.getCaja();
  }

  statusCashRegister() {
    this.accion = 'Status';
    this.getCaja();
  }


  deleteProduct(product: productoVentaModel, index: number) {
    if (this.articlesShell[index].cantidad > 1) {
      this.articlesShell[index].cantidad -= 1

    }
    else {
      this.articlesShell.splice(this.articlesShell.indexOf(product), 1)
    }
    this.total -= product.precio
    this.articulos -= 1
  }


  addArticle(product: productoVentaModel, index: number) {
    this.articlesShell[index].cantidad += 1
    this.articulos += 1
    this.total += product.precio

  }

  addProductVenta(product: productoModel) {
    let artc = new productoVentaModel()
    artc.descripcion = product.descripcion
    artc.precio = product.precio
    artc.talla = product.talla
    artc.sku = product.sku
    artc.idArticulo = product.idArticulo
    artc.fechaIngreso = product.fechaIngreso
    this.articlesShell.push(artc)
    this.articulos += 1
    this.total += product.precio

  }
  cancelarCompra() {
    this.articulos = 0
    this.total = 0
    this.articlesShell = []

  }
  getArticulos() {
    this.inventarioService.getArticulos().subscribe(response => {
      if (response.exito) {
        console.log(response.respuesta)
        this.articles = response.respuesta;
        this.variablesGL.hideLoading();
        setTimeout(() => {
          this.variablesGL.showDialog.next(true);
        }, 100);
      }
    }, err => {
      console.log(err)
    });
  }

  
  getCaja() {
    this.ventasService.getCaja().subscribe(resp => {
      console.log('data vcaja ', resp);
      if (resp.exito) {
        this.cashModel = resp.respuesta;


        if (this.cashModel.fecha != null && this.cashModel.fechaCierre == null) {
          if (this.accion == 'Abrir') {
            console.log('No se puede abrir caja, hay una abierta...');
            this.toastr.info('Actualmente hay una caja abierta', 'Atención!');
            return;
          }
        
        } else if (this.cashModel.fecha != null && this.cashModel.fechaCierre != null) {
          if (this.accion == 'Abrir') {
            console.log('Abrir caja...');
            this.cashModel = new CajaModel();
          } else if (this.accion == 'Cerrar') {
            console.log('ya está cerrada la caja');
            this.toastr.info('Ya está cerrada la caja', 'Atención!');
            this.accion = 'Status';
          }
        }

      

        setTimeout(() => {
          this.variablesGL.showDialog.next(true);
        }, 100);


      } else {

        if (this.accion == 'Abrir') {
          this.cashModel = new CajaModel();
          setTimeout(() => {
            this.variablesGL.showDialog.next(true);
          }, 100);
        } else {
          this.toastr.info(resp.mensaje, 'Atención!');
        }

      }
    },
      err => {
        this.toastr.error('Error al obtener status de la caja', 'Error!');
        this.cashModel = new CajaModel();
      });
  }

  onchangeShear() {
     //alert("detecte la busqueda")


    if (this.queryString && this.queryString.trim().length > 0) {
      this.variablesGL.showLoading();
      this.inventarioService.searchProduct(this.queryString).subscribe(response => {
        if (response.exito) {console.log(response)

          if(response.respuesta[0].existencia=="0"){


            this.toastr.error("No hay Stock del Producto", 'Error!');
            this.variablesGL.hideLoading();
          }else{
          this.variablesGL.hideLoading();
          this.queryString = "";

        
           

            this.toastr.success(response.mensaje, 'Exito!');
            let artc = new productoModel()
            artc.descripcion = response.respuesta[0].descripcion
            artc.precio = response.respuesta[0].precio
            artc.talla = response.respuesta[0].talla
            artc.sku = response.respuesta[0].sku
            artc.idArticulo = response.respuesta[0].idArticulo
            artc.fechaIngreso = response.respuesta[0].fechaIngreso
            this.addProductVenta(artc);
       
          }
          


        } else {
          this.variablesGL.hideLoading();
          this.toastr.error(response.mensaje, 'Error!');
        }
      }, err => {
        this.variablesGL.hideLoading();
        this.toastr.error('Hubo un error al buscar los productos', 'Error!');
      });
    } else {
      this.toastr.error('Ingrese un elemento de busqueda', 'Atención!');
    }
  }

  showDialog() {
    this.ventasService.getCaja().subscribe(resp => {
      console.log('Pagar Valida Caja ', resp);
      if (resp.exito) {
        this.cashModel = resp.respuesta;

        if(this.cashModel.fechaCierre !==  null){
          this.toastr.error("Caja Cerrada Abrir nueva", 'Error!');
         } else{ 
          
          if (this.articulos == 0) {
          this.toastr.warning('No hay Articulos por pagar', 'Atención!');
        }else{
          this.display = true;
    
        }
      } 
      

        

      } 
    },
      err => {
        this.toastr.error('Error al obtener status de la caja', 'Error!');
        this.cashModel = new CajaModel();
      });



  

  }

  showDialogCotizacion() {
    if (this.articulos == 0) {
      this.toastr.warning('No hay Articulos para vizualizar cotizacion', 'Atención!');
    } else {
      this.displayCotizacion = true;
      this.totalLetra = this.numeroALetras(this.total, {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO'
      });
    }

  }


  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('assets/img/logo_huitzil.png');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_CotizaciónHuitzil.pdf`);
    });
  }


  Unidades(num) {

    switch (num) {
      case 1: return 'UN';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE';
    }

    return '';
  }//Unidades()

  Decenas(num) {

    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return 'DIEZ';
          case 1: return 'ONCE';
          case 2: return 'DOCE';
          case 3: return 'TRECE';
          case 4: return 'CATORCE';
          case 5: return 'QUINCE';
          default: return 'DIECI' + this.Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0: return 'VEINTE';
          default: return 'VEINTI' + this.Unidades(unidad);
        }
      case 3: return this.DecenasY('TREINTA', unidad);
      case 4: return this.DecenasY('CUARENTA', unidad);
      case 5: return this.DecenasY('CINCUENTA', unidad);
      case 6: return this.DecenasY('SESENTA', unidad);
      case 7: return this.DecenasY('SETENTA', unidad);
      case 8: return this.DecenasY('OCHENTA', unidad);
      case 9: return this.DecenasY('NOVENTA', unidad);
      case 0: return this.Unidades(unidad);
    }
  }//Unidades()

  DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + ' Y ' + this.Unidades(numUnidades)

    return strSin;
  }//DecenasY()

  Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0)
          return 'CIENTO ' + this.Decenas(decenas);
        return 'CIEN';
      case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
      case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
      case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
      case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
      case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
      case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
      case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
      case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
    }

    return this.Decenas(decenas);
  }//Centenas()

  Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let letras = '';

    if (cientos > 0)
      if (cientos > 1)
        letras = this.Centenas(cientos) + ' ' + strPlural;
      else
        letras = strSingular;

    if (resto > 0)
      letras += '';

    return letras;
  }//Seccion()

  Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
    let strCentenas = this.Centenas(resto);

    if (strMiles == '')
      return strCentenas;

    return strMiles + ' ' + strCentenas;
  }//Miles()

  Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMillones = this.Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
    let strMiles = this.Miles(resto);

    if (strMillones == '')
      return strMiles;

    return strMillones + ' ' + strMiles;
  }//Millones()

  numeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: '',
      letrasMonedaPlural: currency.plural || 'PESOS MEXICANOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || 'PESO MEXICANO', //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVO PESOS MEXICANOS',
      letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVO PESO MEXICANO'
    };

    if (data.centavos > 0) {
      let centavos = ''
      if (data.centavos == 1)
        centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
      else
        centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
      data.letrasCentavos = 'CON ' + centavos
    };

    if (data.enteros == 0)
      return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    if (data.enteros == 1)
      return this.Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
    else
      return this.Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  };



  async PostVentaRegistro(tipoPago: string) {
if(tipoPago=="MULTIPLE")
{
 if(this.totalMultiple===this.total){

  this.articlesShell.forEach(element => {
    const vt = new VentaArticuloModel();

    vt.idArticulo = element.idArticulo;
    vt.cantidad = element.cantidad;
    vt.precioUnitario = element.precio;
    vt.subtotal = element.precio;
    vt.articulo = element;

    //Genera Cadena para Impresion Ticket con salto de pagina
    this.cadenaProductos += element.descripcion + " " + element.cantidad + " " + "$" + element.precio + "MXN" + "\n".toString()
    
    this.ventaArticulo.push(vt);
  });

  const format = 'yyyy-MM-dd';
  const locale = 'en-US';
  const formattedDate = formatDate(new Date, format, locale);

  this.RegistraVenta.idCaja = this.cashModel.idCaja;
  this.RegistraVenta.fecha = formattedDate;
  this.RegistraVenta.noArticulos = this.articlesShell.length
  this.RegistraVenta.noTicket = Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + formattedDate.replace(/(-)+/g, "").trim();;
  this.RegistraVenta.subtotal = this.total;
  this.RegistraVenta.tipoPago = tipoPago;
  this.RegistraVenta.tipoVenta = tipoPago;
  this.RegistraVenta.total = this.total;
  this.RegistraVenta.ventaArticulo = this.ventaArticulo;



  console.log(JSON.stringify(this.RegistraVenta));
  this.ventasService.postRegistroVenta(this.RegistraVenta).subscribe(async resp => {
    console.log('data=> ', resp);

    if (resp.exito) {
      this.toastr.success(resp.mensaje, 'Exito!');

      //code Impresion
      const conector = new ConectorPluginV3();
      conector
        .Iniciar()
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
        .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
        .Feed(1)
        .EscribirTexto("***UniformesHuitzil***")
        .Feed(1)
        .EscribirTexto("Caja:" + this.cashModel.idCaja)
        .Feed(1)
        .EscribirTexto("Ticket:" + this.RegistraVenta.noTicket)
        .Feed(1)
        .EscribirTexto("Articulos:" + this.articulos)
        .Feed(1)
        .EscribirTexto(this.cadenaProductos)
        .Feed(1)
        .EscribirTexto("Total:" + this.total + "MXN")
        .Feed(2)
        .EscribirTexto(this.totalLetra = this.numeroALetras(this.total, {
          plural: 'PESOS MEXICANOS',
          singular: 'PESO MEXICANO',
          centPlural: 'CENTAVOS',
          centSingular: 'CENTAVO'
        }))
        .Feed(2)
        .EscribirTexto("***GRACIAS POR SU PREFERENCIA***")
        .Feed(2)
        .EscribirTexto("***Si requiere factura solo se podra expedir el dia de compra, de lo contrario se contemplara en ventas al Publico en General..***")
        .Feed(1)
        .EscribirTexto("Suc. Frontera: 8666350209 Suc Monclova: 8666320215")
        .Feed(2)
        .Corte(1)
        .Iniciar()
        .Feed(1);

      
     // const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);
      const respuesta = true;

      if (respuesta == true) {
        //Limpiar objetos al finalizar una compra correcta
        this.cadenaProductos=""
        this.RegistraVenta= new VentaModel();
        this.ventaArticulo= [];
        this.articulos=0
        this.total=0
        this.articlesShell=null;

        console.log("Impresión correcta");
        this.display = false;
      } else {
        console.log("Error: " + respuesta);
      }

    }

  },
    err => {
      console.log('error -> ', err);
      this.toastr.error('Ocurrió un error al hacer la operación', 'Error!');
    });

 }else{
  this.toastr.error("Error el importe no esta completo", 'Error!');

 }

}else{


  
    this.articlesShell.forEach(element => {
      const vt = new VentaArticuloModel();

      vt.idArticulo = element.idArticulo;
      vt.cantidad = element.cantidad;
      vt.precioUnitario = element.precio;
      vt.subtotal = element.precio;
      vt.articulo = element;

      //Genera Cadena para Impresion Ticket con salto de pagina
      this.cadenaProductos += element.descripcion + " " + element.cantidad + " " + "$" + element.precio + "MXN" + "\n".toString()
      
      this.ventaArticulo.push(vt);
    });

    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const formattedDate = formatDate(new Date, format, locale);

    this.RegistraVenta.idCaja = this.cashModel.idCaja;
    this.RegistraVenta.fecha = formattedDate;
    this.RegistraVenta.noArticulos = this.articlesShell.length
    this.RegistraVenta.noTicket = Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + formattedDate.replace(/(-)+/g, "").trim();;
    this.RegistraVenta.subtotal = this.total;
    this.RegistraVenta.tipoPago = tipoPago;
    this.RegistraVenta.tipoVenta = tipoPago;
    this.RegistraVenta.total = this.total;
    this.RegistraVenta.ventaArticulo = this.ventaArticulo;



    console.log(JSON.stringify(this.RegistraVenta));
    this.ventasService.postRegistroVenta(this.RegistraVenta).subscribe(async resp => {
      console.log('data=> ', resp);

      if (resp.exito) {
        this.toastr.success(resp.mensaje, 'Exito!');

        //code Impresion
        const conector = new ConectorPluginV3();
        conector
          .Iniciar()
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
          .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
          .Feed(1)
          .EscribirTexto("***UniformesHuitzil***")
          .Feed(1)
          .EscribirTexto("Caja:" + this.cashModel.idCaja)
          .Feed(1)
          .EscribirTexto("Ticket:" + this.RegistraVenta.noTicket)
          .Feed(1)
          .EscribirTexto("Articulos:" + this.articulos)
          .Feed(1)
          .EscribirTexto(this.cadenaProductos)
          .Feed(1)
          .EscribirTexto("Total:" + this.total + "MXN")
          .Feed(2)
          .EscribirTexto(this.totalLetra = this.numeroALetras(this.total, {
            plural: 'PESOS MEXICANOS',
            singular: 'PESO MEXICANO',
            centPlural: 'CENTAVOS',
            centSingular: 'CENTAVO'
          }))
          .Feed(2)
          .EscribirTexto("***GRACIAS POR SU PREFERENCIA***")
          .Feed(2)
          .EscribirTexto("***Si requiere factura solo se podra expedir el dia de compra, de lo contrario se contemplara en ventas al Publico en General..***")
          .Feed(1)
          .EscribirTexto("Suc. Frontera: 8666350209 Suc Monclova: 8666320215")
          .Feed(2)
          .Corte(1)
          .Iniciar()
          .Feed(1);

        
       // const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);
        const respuesta = true;

        if (respuesta == true) {
          //Limpiar objetos al finalizar una compra correcta
          this.cadenaProductos=""
          this.RegistraVenta= new VentaModel();
          this.ventaArticulo= [];
          this.articulos=0
          this.total=0
          this.articlesShell=null;

          console.log("Impresión correcta");
          this.display = false;
        } else {
          console.log("Error: " + respuesta);
        }

      }

    },
      err => {
        console.log('error -> ', err);
        this.toastr.error('Ocurrió un error al hacer la operación', 'Error!');
      });
    }
  }


  onchangeTotal(event) {

   
    
    this.totalMultiple=this.totalMultipleT * 1 + this.totalMultipleF * 1
console.log( this.totalMultiple)
  }

}
