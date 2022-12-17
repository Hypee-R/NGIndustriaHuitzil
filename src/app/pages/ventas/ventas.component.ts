import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CajaModel } from 'src/app/models/caja.model';
import { productoModel } from 'src/app/models/productos.model';
import { productoVentaModel } from 'src/app/models/productoVenta.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { VentaModel } from 'src/app/models/venta.model';
import { VentaArticuloModel } from 'src/app/models/VentaArticulo.Model';


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})


export class VentasComponent implements OnInit {
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
  ventaArticulo:VentaArticuloModel[]=[];
  
  openCash: Boolean = false
  //lstProducts: productoModel[] = [];
  cols: any[] = [];
  //colsProducts:any[] = [];
  rows = 0;
  accion = '';
  openProducts = '';
  articulos = 0
  total = 0
  totalLetra = "";
  clienteName: string = '';
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
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
      this.rows = 9;
    }

  }

  selectedValues: string[] = [];

  ngOnInit(): void {
    this.loading = false

  }


  getResultsClients() {
    if (this.queryStringClient && this.queryStringClient.trim().length > 0) {
      this.variablesGL.showLoading();
      this.proveedoresService.searchCliente(this.queryStringClient).subscribe(response => {
        if (response.exito) {
          this.variablesGL.hideLoading();

          this.toastr.success(response.mensaje, 'Exito!!!');
          this.clienteName = response.respuesta[0].nombre;
          console.log('resultados de la busqueda: ', this.clienteName);
        } else {
          this.variablesGL.hideLoading();
          this.clienteName = '';
          this.toastr.error(response.mensaje, 'Error!');
        }
      }, err => {
        this.variablesGL.hideLoading();
        this.toastr.error('Hubo un error al buscar cliente', 'Error!');
      });
    } else {
      this.toastr.error('Ingrese un elemento de busqueda', 'Atención!');
    }
  }

  openProductsM() {
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
        this.articles = response.respuesta;
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
          // else if(this.accion == 'Cerrar'){
          //   console.log('No hay una caja abierta para cerrar');
          //   this.toastr.info('No hay caja abierta para cerrar', 'Atención!');
          //   return;
          // }
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

        // if(this.accion == 'Abrir' && this.cashModel.fecha != null && this.cashModel.fechaCierre != null){
        //     console.log('Abrir caja...');
        //     this.cashModel = new CajaModel();
        // }else if(this.accion == 'Abrir' && this.cashModel.fecha != null && this.cashModel.fechaCierre == null){
        //   console.log('No se puede abrir caja, hay una abierta...');
        //   this.toastr.info('Actualmente hay una caja abierta', 'Atención!');
        //   return;
        // }

        // // if(this.accion == 'Cerrar' && this.cashModel.fechaCierre == null){
        // //     console.log('Cerrar caja...');
        // // }else
        // if(this.accion == 'Cerrar' && this.cashModel.fecha != null && this.cashModel.fechaCierre == null){
        //     console.log('No hay una caja abierta para cerrar');
        //     this.toastr.info('No hay caja abierta para cerrar', 'Atención!');
        //     return;
        // }else if(this.accion == 'Cerrar' && this.cashModel.fecha != null && this.cashModel.fechaCierre != null){
        //     console.log('ya está cerrada la caja');
        //     this.toastr.info('Ya está cerrada la caja', 'Atención!');
        //     this.accion = 'Status';
        //     // return;
        // }

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
    // alert("detecte la busqueda")
    if (this.queryString && this.queryString.trim().length > 0) {
      this.variablesGL.showLoading();
      this.inventarioService.searchProduct(this.queryString).subscribe(response => {
        if (response.exito) {
          this.variablesGL.hideLoading();

          this.toastr.success(response.mensaje, 'Exito!!!');
          console.log('resultados de la busqueda: ', response.respuesta);
          this.queryString = "";


          let artc = new productoModel()
          artc.descripcion = response.respuesta[0].descripcion
          artc.precio = response.respuesta[0].precio
          artc.talla = response.respuesta[0].talla
          artc.sku = response.respuesta[0].sku
          artc.idArticulo = response.respuesta[0].idArticulo
          this.addProductVenta(artc);


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
    if (this.articulos == 0) {
      this.toastr.warning('No hay Articulos por pagar', 'Atención!');
    } else {
      this.display = true;
    }

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

      const img = canvas.toDataURL('image/PNG');

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



  PostVentaRegistro() {
    console.log("==============venta==============");
    this.articlesShell.forEach(element => {
      const  vt = new VentaArticuloModel();
      vt.idVentaArticulo= 23;
      vt.idVenta= 1;
      vt.idArticulo=element.idArticulo;
      vt.cantidad= element.cantidad;
      vt.precioUnitario=element.precio;
      vt.subtotal=  this.total;
      vt.articulo=element;
    
      this.ventaArticulo.push(vt) ;
       console.log(element)
    });

    this.RegistraVenta.idVenta = 1;
    this.RegistraVenta.idCaja = 34;
    this.RegistraVenta.fecha = new Date().toLocaleString();
    this.RegistraVenta.noTicket = Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString();
    this.RegistraVenta.subtotal = this.total;
    this.RegistraVenta.tipoPago = "EFECTIVO";
    this.RegistraVenta.tipoVenta = "CONTADO";
    this.RegistraVenta.total = this.total;
    this.RegistraVenta.ventaArticulo =this.ventaArticulo;
   
    //  [
    //   {
    //     idVentaArticulo: 95,
    //     idVenta: 1,
    //     idArticulo: 8,
    //     cantidad: 3,
    //     precioUnitario: 250.00,
    //     subtotal: 750.00,
    //     articulo:
    //     {
    //       idArticulo: 2,
    //       unidad: "5",
    //       existencia: "10",
    //       descripcion: "Playeras tipo polo blancas",
    //       fechaIngreso: "2022-08-17",
    //       idUbicacion: 1,
    //       idCategoria: 1,
    //       idTalla: 3,
    //       talla: "M",
    //       ubicacion: "Coyoacan",
    //       categoria: "Playera tipo polo",
    //       imagen: "",
    //       precio: 250.00,
    //       sku: "01PTPM"
    //     },
    //     venta: null
    //   },
    //   {
    //     idVentaArticulo: 2, idVenta: 1, idArticulo: 2, cantidad: 3, precioUnitario: 200.00, subtotal: 600.00,
    //     articulo:
    //     {
    //       idArticulo: 2,
    //       unidad: "5",
    //       existencia: "50",
    //       descripcion: "Playeras tipo polo",
    //       fechaIngreso: "2022-10-19",
    //       idUbicacion: 2,
    //       idCategoria: 1,
    //       idTalla: 1,
    //       talla: "XS",
    //       ubicacion: "Almacen 2",
    //       categoria: "Playera tipo polo",
    //       imagen: "",
    //       precio: 200.00,
    //       sku: "01PTXS"
    //     },
    //     venta: null
    //   }
    // ]

      console.log(this.RegistraVenta);
      console.log(JSON.stringify(this.RegistraVenta))
    this.ventasService.postRegistroVenta(this.RegistraVenta).subscribe(resp => {
      console.log('data=> ', resp);

      console.log(resp);
      if (resp.exito) {
        this.toastr.success(resp.mensaje, 'Exito!');
        // Extraemos el
        const printContent = document.getElementById("print");
        const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write(printContent.innerHTML);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();


      } else {
        this.toastr.info(resp.mensaje, 'Atención!')
      }
    },
      err => {
        console.log('error -> ', err);
        this.toastr.error('Ocurrió un error al hacer la operación', 'Error!');
      });
  }



}
