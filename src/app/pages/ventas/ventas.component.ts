import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CajaModel } from 'src/app/models/caja.model';
import { productoModel } from 'src/app/models/productos.model';
import { productoVentaModel } from 'src/app/models/productoVenta.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { VentaModel } from 'src/app/models/venta.model';
import { VentaArticuloModel } from 'src/app/models/VentaArticulo.Model';
import { formatDate } from '@angular/common';
import ConectorPluginV3 from "src/app/services/ConectorPluginV3";
import { CatClienteModel } from 'src/app/models/clientes.model';
import { UsuarioAuthModel } from 'src/app/models/usuario-auth.model';
import { CambiosDevolucionesModel } from 'src/app/models/cambios-devoluciones.model';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],

})


export class VentasComponent implements OnInit {

  activeState: boolean[] = [false];
  cadenaProductos: string = "\n";
  impresoras = [];
  impresoraSeleccionada: string = "Caja";
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
  accionAdd = '';
  accionCancelacion = ''
  openProducts = '';
  openCancel = '';
  articulos = 0
  total = 0
  descuento = 0
  porcentajeDescuentoAplicar = 0
  totalLetra = "";
  totalVenta = 0;
  cambioVenta: number;
  totalMultipleF: number;
  totalMultipleT: number;
  //Busqueda CLIENTES
  clienteName = 'MOSTRADOR';
  //resultsClientes:  CatProveedorModel[];
  selectedclienteNameAdvanced: CatClienteModel;
  filteredClients: CatClienteModel[];
  clientes: CatClienteModel[];
  //Busqueda CLIENTES
  cantidades: number[] = []
  RegistraVenta: VentaModel = new VentaModel();
  cashModel: CajaModel;
  CurrentDate = new Date();
  user: UsuarioAuthModel;
  //Datos de cancelacion
  lstCambiosDevoluciones: CambiosDevolucionesModel[] = [];
  selectedCambio: CambiosDevolucionesModel;
  constructor(
    private toastr: ToastrService,
    private ventasService: VentasService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private cambiosDevolucionesService: VentasService
  ) {
    this.selectedclienteNameAdvanced = new CatClienteModel()
    this.cols = [

      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'descripcion', header: 'PRODUCTO' },
      { field: 'precio', header: 'PRECIO' },
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
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }


  getResultsClients(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.clientes.length; i++) {
      let cliente = this.clientes[i];
      if (cliente.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(cliente);
      }
    }
    this.filteredClients = filtered;
    this.clienteName = event.query;
  }



  openProductsM() {
    //this.variablesGL.showLoading();
    this.accion = ''
    this.accionCancelacion = '';
    this.accionAdd = ''
    this.openProducts = "Productos"
    this.articlesSelected = []
    this.getArticulos()
  }

  openCashRegister() {
    this.accionCancelacion = '';
    this.openProducts = ""
    this.accionAdd = ''
    this.accion = 'Abrir';
    this.getCaja();

  }

  closeCashRegister() {
    this.openProducts = ""
    this.accionAdd = ''
    this.accionCancelacion = '';
    this.accion = 'Cerrar';
    this.getCaja();
  }

  statusCashRegister() {
    this.accionCancelacion = '';
    this.openProducts = ""
    this.accionAdd = ''
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
    this.totalLetra = this.variablesGL.numeroALetras(this.total - this.descuento, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });

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
    this.totalLetra = this.variablesGL.numeroALetras(this.total - this.descuento, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });
  }
  cancelarCompra() {
    this.toastr.error('Se cancelo la Venta correctamente', 'Atención!');
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
        if (response.exito) {
          if (response.respuesta[0].existencia == "0") {
            this.toastr.error("No hay Stock del Producto", 'Error!');
            this.variablesGL.hideLoading();
          } else {
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

        if (this.cashModel.fechaCierre !== null) {
          this.toastr.error("Caja Cerrada Abrir nueva", 'Error!');
        } else {

          if (this.articulos == 0) {
            this.toastr.warning('No hay Articulos por pagar', 'Atención!');
          } else {
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
      this.totalLetra = this.variablesGL.numeroALetras(this.total - this.descuento, {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO'
      });
    }

  }

  getCambiosyDevoluciones() {
    this.loading = true;
    this.cambiosDevolucionesService.getCambiosDevoluciones().subscribe(response => {
      if (response.exito) {
        console.log(response.respuesta)
        this.lstCambiosDevoluciones = response.respuesta
        this.lstCambiosDevoluciones.forEach(cambio => {
          cambio.fecha = this.variablesGL.getFormatoFecha(cambio.fecha).toString();
        });
        this.loading = false;
        // console.log('cambios devoluciones --> ', this.lstCambiosDevoluciones);

      } else {
        this.lstCambiosDevoluciones = [];
        this.loading = false;
      }
    }, err => {
      this.loading = false;;
    });
  }

  downloadTicket() {

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



  async PostVentaRegistro(tipoPago: string) {
    if (tipoPago == "MULTIPLE") {
      this.totalVenta = this.totalMultipleT + this.totalMultipleF
   //   if (this.totalVenta == this.total - this.descuento) {

        this.changePage();
        this.RegistraVentaValid(tipoPago);
      // } else {
      //   this.toastr.error("Error el importe no esta correcto, Usted pago:" + this.totalVenta + ", y el total es:" + this.total + ".", 'Error!');
      // }

    }
    if (tipoPago == "EFECTIVO") {
    //  if (this.totalVenta == this.total - this.descuento) {
        this.changePage();
        this.RegistraVentaValid(tipoPago);

      // } else {
      //   this.toastr.error("Error el importe no esta correcto, Usted pago:" + this.totalVenta + ", y el total es:" + this.total + ".", 'Error!');

      // }


    }
    if (tipoPago == "TARJETA") {
      this.toastr.warning("Recuerda Validar el cobro en terminal la venta se registrara ", 'Atencion!');
      if (this.totalVenta == this.total - this.descuento) {
        this.changePage();
        this.RegistraVentaValid(tipoPago);{

        }

     } else {
         this.toastr.error("Error el importe debe ser exacto, Usted pago:" + this.totalVenta + ", y el total es:" + this.total + ".", 'Error!');

       }
    }
  }




  openModalAdd() {
    this.accion = ''
    this.openProducts = ''
    this.accionAdd = 'Agregar';

    //his.selectedCliente = new CatClienteModel();
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);

  }

  //Funcion de Venta Limpio separada
  async RegistraVentaValid(tipoPago: string) {
    this.articlesShell.forEach(element => {
      const vt = new VentaArticuloModel();

      vt.idArticulo = element.idArticulo;
      vt.cantidad = element.cantidad;
      vt.precioUnitario = element.precio;
      vt.subtotal = element.precio;
      vt.articulo = element;

      //Genera Cadena para Impresion Ticket con salto de pagina
      this.cadenaProductos += element.descripcion + " " + element.cantidad + " " + "$" + element.precio + "MXN" + " " + "$" + element.precio + "MXN" + "\n".toString()

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
    this.RegistraVenta.tipoVenta = "CONTADO";
    this.RegistraVenta.total = this.total - this.descuento;
    this.RegistraVenta.tarjeta = this.totalMultipleT;
    this.RegistraVenta.efectivo = this.totalMultipleF;
    this.RegistraVenta.ventaArticulo = this.ventaArticulo;
    this.RegistraVenta.descuento = this.porcentajeDescuentoAplicar;



    console.log(JSON.stringify(this.RegistraVenta));
    this.ventasService.postRegistroVenta(this.RegistraVenta).subscribe(async resp => {
      console.log('data=> ', resp);
      if (resp.exito) {
        console.log(this.selectedclienteNameAdvanced)
        console.log(this.clienteName)
        console.log(this.RegistraVenta.fecha)
        //code Impresion
        const conector = new ConectorPluginV3();
        conector
          .Iniciar()
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
          .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
          .Feed(1)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
          .EscribirTexto("Caja:" + this.cashModel.idCaja)
          .Feed(1)
          .EscribirTexto("Cajero:" + this.user.nombre)
          .Feed(1)
          .EscribirTexto("Fecha:" + this.RegistraVenta.fecha)
          .Feed(1)
          .EscribirTexto("Ticket:" + this.RegistraVenta.noTicket)
          .Feed(1)
          .EscribirTexto("Articulos:" + this.articulos)
          .Feed(1)
          .EscribirTexto("_____________________________________")
          .Feed(1)
          .EscribirTexto("ARTICULO | CANT| P/U|TOTAL")
          .Feed(1)
          .EscribirTexto("_____________________________________")
          .Feed(1)
          .EscribirTexto(this.cadenaProductos)
          .Feed(1)
          .EscribirTexto("_____________________________________")
          .Feed(2)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
          .EscribirTexto("Descuento:" +this.descuento + "MXN")
          .Feed(1)
          .EscribirTexto("Subtotal:" + this.total + "MXN")
          .Feed(1)
          .EscribirTexto("Total:" + this.getDescuentoAplicado(this.total,this.descuento)+ "MXN")
          .Feed(1)
          .EscribirTexto("Tipo Pago:" +this.getTotalmontoMultiple(this.RegistraVenta))
          .Feed(1)
          .EscribirTexto("Cambio:" + this.cambioVenta + "MXN")
          .Feed(1)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
          .EscribirTexto(this.totalLetra = this.variablesGL.numeroALetras(this.total - this.descuento, {
            plural: 'PESOS MEXICANOS',
            singular: 'PESO MEXICANO',
            centPlural: 'CENTAVOS',
            centSingular: 'CENTAVO'
          }))
          .Feed(2)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
          .EscribirTexto("***GRACIAS POR SU PREFERENCIA***")
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
          .Feed(2)
          .EscribirTexto("***Venta publico Gral, Si requiere factura solicitarla durante la venta***")
          .Feed(1)
          .EscribirTexto("Suc. Frontera: 8666350209 Suc Monclova: 8666320215")
          .Corte(1)
          .Iniciar()
          .Feed(1);

        try {
          const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);

          if (respuesta == true) {
            //Limpiar objetos al finalizar una compra correcta
            this.cadenaProductos = ""
            this.RegistraVenta = new VentaModel();
            this.ventaArticulo = [];
            this.articulos = 0
            this.total = 0
            this.articlesShell = []
            this.totalVenta = 0
            this.totalMultipleF = 0;
            this.totalMultipleT = 0;
            this.activeState = [false];
            this.totalVenta=0
            this.toastr.success(resp.mensaje, 'Exito!');
            console.log("Impresión correcta");
            this.display = false;
          } else {
            console.log("Error: " + respuesta);
          }

        } catch (error) {
          console.log(error)
          this.toastr.warning(error, 'Atencion!');
          //Limpiar objetos al finalizar una compra correcta
          this.cadenaProductos = ""
          this.RegistraVenta = new VentaModel();
          this.ventaArticulo = [];
          this.articulos = 0
          this.total = 0
          this.articlesShell = []
          this.display = false;
        }



      }

    },
      err => {
        console.log('error -> ', err);
        this.toastr.error('Ocurrió un error al hacer la operación', 'Error!');
      });


  }

  openModalAddCancel() {
    this.accion = ''
    this.openProducts = ''
    this.accionCancelacion = 'Agregar';
    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }


//
getDescuentoAplicado(total: number, descuento: number): number {
  return total - descuento;
}

getTotalmontoMultiple(venta:VentaModel): string {
  if (venta.tipoPago === 'MULTIPLE') {
    const montoTarjeta = venta.tarjeta || 0; // Utiliza 0 si el monto de la tarjeta no está definido
    const montoEfectivo = venta.efectivo || 0; // Utiliza 0 si el monto en efectivo no está definido
    return `MULTIPLE:Tarjeta: ${montoTarjeta}, Efectivo: ${montoEfectivo}`;
  } else {
    return ` ${venta.tipoPago}`;
  }
}


  changePage() {
    // console.log(this.totalVenta + ":" + this.total)
    // console.log(this.total -this.descuento)

    if (this.totalVenta  > this.total-this.descuento) {
      this.cambioVenta = Math.abs(this.total - this.totalVenta -this.descuento);


      this.toastr.success("Su cambio es :" + this.cambioVenta, 'Cambio!');
    } else {
      console.log("no es igual");
      this.cambioVenta = 0
      // this.toastr.error("Error el importe no esta correcto, Usted pago:" + this.totalVenta + ", y el total es:" + this.total + ".", 'Error!');

    }


  }

  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

  onTabClose(event) {
    alert({ severity: 'info', summary: 'Tab Closed', detail: 'Index: ' + event.index })
  }

  onTabOpen(event) {

    alert({ severity: 'info', summary: 'Tab Expanded', detail: 'Index: ' + event.index })
  }

  onDiscountSelected(selectedDiscount: number) {
    // Manejar el valor seleccionado aquí
    console.log("Descuento seleccionado:", selectedDiscount['value']);
    // También puedes realizar otras operaciones según sea necesario
    const porcentajeDescuento = selectedDiscount['value'];
    console.log(porcentajeDescuento)

    this.porcentajeDescuentoAplicar = porcentajeDescuento
    // Calcular el descuento
    const descuento = (this.total * porcentajeDescuento) / 100;
    console.log(descuento)

    this.descuento = descuento
    this.totalLetra = this.variablesGL.numeroALetras(this.total - this.descuento, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });
  }


}
