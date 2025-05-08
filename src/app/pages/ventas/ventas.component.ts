import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CajaModel } from 'src/app/models/caja.model';
import { productoModel } from 'src/app/models/productos.model';
import { productoVentaModel } from 'src/app/models/productoVenta.model';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';
import { jsPDF } from "jspdf";
import { VentaModel } from 'src/app/models/venta.model';
import { VentaArticuloModel } from 'src/app/models/VentaArticulo.Model';
import { formatDate } from '@angular/common';
import ConectorPluginV3 from "src/app/services/ConectorPluginV3";
import { CatClienteModel } from 'src/app/models/clientes.model';
import { UsuarioAuthModel } from 'src/app/models/usuario-auth.model';
import { CambiosDevolucionesModel } from 'src/app/models/cambios-devoluciones.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { CatTiposPago } from 'src/app/models/tipoPago';
import Swal from 'sweetalert2';

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
  isButtonDisabled: boolean = false; //se utiliza para bloquear la venta hasta que se termina
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
  selectedclienteNameAdvanced: CatClienteModel;
  filteredClients: CatClienteModel[];
  clientes: CatClienteModel[];
  selectedcliente: CatClienteModel;
  //Busqueda CLIENTES
  cantidades: number[] = []
  RegistraVenta: VentaModel = new VentaModel();
  cashModel: CajaModel;
  CurrentDate = new Date();
  user: UsuarioAuthModel;
  //Datos de cancelacion
  lstCambiosDevoluciones: CambiosDevolucionesModel[] = [];
  selectedCambio: CambiosDevolucionesModel;
  selectedOption: any = { value: 'VEN', label: 'VENTA' };
  options = [
    { value: 'VEN', label: 'VENTA' },
    { value: 'ABN', label: 'ABONO' },
    { value: 'SAL', label: 'SALIDA' },
    { value: 'ENT', label: 'ENTRADA' },
   
    // { value: 'DEV', label: 'DEVOLUCION' },
  ];
  title = 'VENTA';
  titlePay = 'PAGAR';

  cardStyle: any = {
    background: '#ffffff ', // Valor predeterminado
  };

  checked: boolean = false;
  iconPay = 'pi pi-money-bill';
  tiposDePago: CatTiposPago[];
  
  cashOpen = false;
  @ViewChild('fileInput', { static: false }) myInput!: any;
  showMultiples = false;
  pagando: boolean = false;
  focusPay = true;
  listaSelected = 'Precio - PRECIO ETIQUETA';
  tipoPago1: CatTiposPago;
  tipoPago2: CatTiposPago;
  selectedLista: any;
  constructor(
    private toastr: ToastrService,
    private ventasService: VentasService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private cambiosDevolucionesService: VentasService,
    private clientesService: ClientesService
  ) {
 
    this.tiposDePago = [
      {
        id: 1,
        nombre: 'MOVIMIENTOS',
        descripcion: 'momientos de articulos',
        icon: 'pi pi-money-bill',
      },
      {
        id: 2,
        nombre: 'APARTADOS',
        descripcion: 'Pago con tarjeta',
        icon: 'pi pi-money-bill',
      },
    ];

    this.selectedclienteNameAdvanced = new CatClienteModel()
    this.cols = [

      { field: 'cantidad', header: 'Cantidad' },
      // { field: 'imagen', header: 'Imagen' },
      { field: 'descripcion', header: 'Producto' },
      { field: 'precio', header: 'Precio' },
      { field: 'sku', header: 'SKU' }

    ];

    this.statusPanubicacion = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if (status == 'celular') {
      this.rows = 6;
    } else if (status == 'tablet') {
      this.rows = 4;
    } else if (status == 'laptop') {
      this.rows = 3;
    } else {
      this.rows = 6
    }
    const option = localStorage.getItem('opcion');
    // console.info(option);
    if (option != undefined) {
      const op = JSON.parse(option);
      this.selectedOption = { value: op, label: 'VENTA' };

      if (op == 'VEN') {
        this.titlePay = 'PAGAR';
        this.iconPay = 'pi pi-money-bill';
        this.title = 'VENTA';
        this.cardStyle = {
          background: '#ffffff ', // Valor predeterminado
        };
        this.getTiposPago();
      } else if (op == 'ABN') {
        this.titlePay = 'ABONO';
        this.title = 'ABONO';
        this.iconPay = 'pi pi-upload';
        this.cardStyle = {
          background: '#fdfddc', // Valor predeterminado
        };
      } else if (op == 'ENT') {
        this.titlePay = 'ENTRADA';
        this.title = 'ENTRADA DE EFECTIVO';
        this.iconPay = 'pi pi-upload';
        this.cardStyle = {
          background: '#fdfddc', // Valor predeterminado
        };
      } else {
        this.title = 'SALIDA DE EFECTIVO';
        this.titlePay = 'SALIDA';
        this.iconPay = 'pi pi-download';
        this.cardStyle = {
          background: '#e2f6fd', // Valor predeterminado
        };
      }

      //this.selectedOption = op;
    } else {
      this.selectedOption = { value: 'VEN', label: 'VENTA' };
    }
    setTimeout(() => {
      if (this.selectedOption.value === 'VEN') {
        this.myInput.nativeElement.focus();
      }
    });
  }
 
  selectedValues: string[] = [];
  handleVisibilityChange() {
    if (document.hidden) {
      if (this.selectedOption.value == 'VEN') {
        this.myInput.nativeElement.focus();
      }
    } else {
      if (this.selectedOption.value == 'VEN') {
        this.myInput.nativeElement.focus();
      }
    }
  }


  async ngAfterViewInit() {
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
    setTimeout(() => {
      if (this.selectedOption.value === 'VEN') {
        this.myInput.nativeElement.focus();
      }
    });
  }


  async ngOnInit() {

    this.loading = false
    this.getCaja();

    this.getClientes()
    this.user = JSON.parse(localStorage.getItem('usuario'));
    setTimeout(() => {
      this.myInput.nativeElement.focus();
    });
  }

  getClientes() {
    this.clientes = []
    this.clientesService.getClientesBySucursal().subscribe(response => {
      if (response.exito) {
        this.clientes = response.respuesta;
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
    if (this.cashOpen) {
      this.toastr.info('Ya hay una caja abierta', 'Atención!');
      return;
    }
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
    console.log(product, index)
    this.articlesShell[index].cantidad += 1
    this.articulos += 1
    this.total += product.precio
    console.log(this.total)
    this.totalLetra = this.variablesGL.numeroALetras(this.total - this.descuento, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });

  }

  addProductVenta(product: productoModel) {
    if (this.myInput != undefined) {
      this.myInput.nativeElement.focus();
    }


    let artc = new productoVentaModel()
    artc.descripcion = product.descripcion
    artc.precio = product.precio
    // artc.talla = product.talla
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
    if (this.articlesShell.length == 0) {
      return;
    }
    Swal.fire({
      title: `Está seguro de limpiar la venta`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.toastr.error('Se cancelo la Venta correctamente', 'Atención!');
        this.articulos = 0;
        this.total = 0;
        this.articlesShell = [];
        localStorage.setItem('ticket', JSON.stringify(this.articlesShell));
      } else if (result.isDenied) {
      }
    });
    // this.toastr.info('Se limpio la Venta correctamente', 'Atención!');
    // this.articulos = 0
    // this.total = 0
    // this.articlesShell = []

  }

  getArticulos() {
    // Define los filtros iniciales
    const initialFilters = {
      queryString: '', // Puedes dejar esto vacío o proporcionar un valor predeterminado si lo deseas
    //  sucursal: this.variablesGL.getSucursal(), // Obtiene la sucursal actual
      sku: '', // Filtro inicial vacío
      descripcion: '', // Filtro inicial vacío
      talla: '', // Filtro inicial vacío
      ubicacion: this.variablesGL.getSucursal(), // Filtro inicial vacío
      page: 0, // Página inicial
      size: 100 // Número de artículos por página
    };

    // Muestra la carga mientras se hace la solicitud
    this.variablesGL.showLoading();

    // Llama al servicio con los filtros iniciales
    this.inventarioService.searchProductDemanda(initialFilters).subscribe(response => {
      if (response.exito) {
        // Actualiza los artículos con la respuesta del servicio
        this.articles = response.respuesta;
        console.log('Artículos iniciales:', this.articles);
        this.variablesGL.hideLoading();

        // Muestra el diálogo después de un breve retraso
        setTimeout(() => {
          this.variablesGL.showDialog.next(true);
        }, 100);
      } else {
        // Manejo de errores
        this.variablesGL.hideLoading();
        this.toastr.error(response.mensaje, 'Error!');
      }
    }, err => {
      // Manejo de errores en la solicitud
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al obtener los artículos', 'Error!');
      console.log(err);
    });
  }


  getCaja() {
    this.ventasService.getCaja().subscribe(
      (resp) => {
        if (resp.exito) {
          this.cashOpen = true;
          //this.myInput.nativeElement.focus();
          this.cashModel = resp.respuesta;
          if (
            this.cashModel.fecha != null &&
            this.cashModel.fechaCierre == null
          ) {
            if (this.accion == 'Abrir') {
              //console.log('No se puede abrir caja, hay una abierta...');
              this.toastr.info('Actualmente hay una caja abierta', 'Atención!');
              return;
            }
          } else if (
            this.cashModel.fecha != null &&
            this.cashModel.fechaCierre != null
          ) {
            if (this.accion == 'Abrir') {
              //console.log('Abrir caja...');
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
          // console.log('Esta cerrada la caja')
          this.cashOpen = false;
          this.myInput.nativeElement.disabled = true;
          // this.openNewCashRegister()
          // this.openCashRegister()
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
      (err) => {
        this.toastr.error('Error al obtener status de la caja', 'Error!');
        this.cashModel = new CajaModel();
      }
    );
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
            // artc.talla = response.respuesta[0].talla
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
    //this.nameInput.nativeElement.focus();
    this.pagando = false;
    if (!this.cashOpen) {
      this.toastr.error('Abre una caja para continuar', 'Atención!');
      return;
    }

    //console.info('selectedOption-->', this.selectedOption.value);
    if (this.selectedOption.value == 'ABN') {
      this.showMultiples = false;
      this.getTiposPago();
      this.totalVenta = this.total;
      if (this.selectedcliente == undefined) {
        this.toastr.error(
          'Seleccione un cliente para realizar la venta',
          'Atención!'
        );
        return;
      }

      this.ventasService.getCaja().subscribe(
        (resp) => {
          if (resp.exito) {
            this.cashModel = resp.respuesta;

            if (!this.cashModel.estatus) {
              this.toastr.error('Caja Cerrada Abrir nueva', 'Error!');
            } else {
              /* if (this.articulos == 0) {
                this.toastr.warning('No hay Articulos por pagar', 'Atención!');
              } else {*/
              this.display = true;
              //  }
            }
          }
        },
        (err) => {
          this.toastr.error('Error al obtener status de la caja', 'Error!');
          this.cashModel = new CajaModel();
        }
      );
    } else if (this.selectedOption.value == 'VEN') {
      this.showMultiples = false;
      this.getTiposPago();
      this.totalVenta = this.total;
      if (this.selectedcliente == undefined) {
        this.toastr.error(
          'Seleccione un cliente para realizar la venta',
          'Atención!'
        );
        return;
      }

      this.ventasService.getCaja().subscribe(
        (resp) => {
          if (resp.exito) {
            this.cashModel = resp.respuesta;

            if (!this.cashModel.fecha) {
              this.toastr.error('Caja Cerrada Abrir nueva', 'Error!');
            } else {
              if (this.articulos == 0) {
                this.toastr.warning('No hay Articulos por pagar', 'Atención!');
              } else {
                this.display = true;
              }
            }
          }
        },
        (err) => {
          this.toastr.error('Error al obtener status de la caja', 'Error!');
          this.cashModel = new CajaModel();
        }
      );
    } else if (this.selectedOption.value == 'ENT') {
      if (this.articulos == 0) {
        this.toastr.warning('No hay Articulos para entregar', 'Atención!');
        return;
      }
      this.display = true;

      // this.PostVentaRegistroMov('ENTRADA');
      //this.display = true;
    } else {
      if (this.articulos == 0) {
        this.toastr.warning('No hay Articulos para dar salida', 'Atención!');
        return;
      }
      this.display = true;
      //this.PostVentaRegistroMov('SALIDA');
      //this.display = true;
    }
  }
  // showDialog() {

  //   this.ventasService.getCaja().subscribe(resp => {
  //     console.log('Pagar Valida Caja ', resp);
  //     if (resp.exito) {
  //       this.cashModel = resp.respuesta;

  //       if (this.cashModel.fechaCierre !== null) {
  //         this.toastr.error("Caja Cerrada Abrir nueva", 'Error!');
  //       } else {

  //         if (this.articulos == 0) {
  //           this.toastr.warning('No hay Articulos por pagar', 'Atención!');
  //         } else {
  //           this.display = true;
  //           this.isButtonDisabled = false; // Habilitar el botón al finalizar
  //         }
  //       }

  //     }
  //   },
  //     err => {
  //       this.toastr.error('Error al obtener status de la caja', 'Error!');
  //       this.cashModel = new CajaModel();
  //     });





  // }

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

  // downloadPDF() {
  //   // Extraemos el
  //   const DATA = document.getElementById('htmlData');
  //   const doc = new jsPDF('p', 'pt', 'a4');
  //   const options = {
  //     background: 'white',
  //     scale: 3
  //   };
  //   html2canvas(DATA, options).then((canvas) => {
  //     const img = canvas.toDataURL('assets/img/LogoSole.jpeg');
  //     // Add image Canvas to PDF
  //     const bufferX = 15;
  //     const bufferY = 15;
  //     const imgProps = (doc as any).getImageProperties(img);
  //     const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //     doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
  //     return doc;
  //   }).then((docResult) => {
  //     docResult.save(`${new Date().toISOString()}_CotizaciónHuitzil.pdf`);
  //   });
  // }



  async PostVentaRegistro(tipoPago: string) {
    console.log('TIPO PAGO===>',tipoPago)
    this.isButtonDisabled = true;
    if (tipoPago == "MULTIPLE") {
      this.totalVenta = this.totalMultipleT + this.totalMultipleF;

      if (this.totalVenta > this.total) {
        const sobrante = this.totalVenta - this.total;
        this.totalMultipleF -= sobrante;
        this.cambioVenta = sobrante
        this.RegistraVenta.total = this.totalVenta; // Asignar totalVenta a total si es mayor que total actual
      }


      this.changePage();
      this.RegistraVentaValid(tipoPago);


    }
    if (tipoPago == "EFECTIVO") {
      console.info(this.totalVenta, this.total - this.descuento)
      if (this.totalVenta >= (this.total - this.descuento)) {
        this.changePage();
        this.RegistraVentaValid(tipoPago);

      } else {
        this.isButtonDisabled=false
        this.toastr.warning("Error el importe debe ser mayor o igual al total de la venta, Usted pago:" + this.totalVenta + ", y el total es:" + this.total + ".", 'Error!');

      }


    }
    if (tipoPago == "TARJETA") {
      this.toastr.warning("Recuerda Validar el cobro en terminal la venta se registrara ", 'Atencion!');
      if (this.totalVenta == this.total - this.descuento) {
        this.changePage();
        this.RegistraVentaValid(tipoPago); {

        }

      } else {
        this.toastr.error("Error el importe debe ser exacto, Usted pago:" + this.totalVenta + ", y el total es:" + this.total + ".", 'Error!');

      }
    }

  if (this.selectedOption.value == 'ENT') {
    this.changePage();
    this.RegistraVentaValid(tipoPago);
  } else {
    this.changePage();
    this.RegistraVentaValid(tipoPago);
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
      vt.subtotal = element.precio * element.cantidad; // Multiplica el precio por la cantidad
      //vt.articulo = element;

      //Genera Cadena para Impresion Ticket con salto de pagina
      this.cadenaProductos += element.descripcion + "|" + element.cantidad + "|" + "$" + element.precio + "MXN" + "|" + "$" + vt.subtotal + "MXN" + "\n".toString()

      this.ventaArticulo.push(vt);
    });

    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const formattedDate = formatDate(new Date, format, locale);
    // Obtener la fecha y hora actual
    const currentDate = new Date();

    // Obtener los últimos 2 dígitos del año (e.g., '24' para 2024)
    const year = currentDate.getFullYear().toString().slice(-2);

    // Obtener el mes en formato de 2 dígitos (e.g., '08' para agosto)
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    // Obtener el día en formato de 2 dígitos (e.g., '26' para el día 26)
    const day = currentDate.getDate().toString().padStart(2, '0');

    // Generar un número aleatorio de 2 dígitos (entre 10 y 99)
    const randomTwoDigits = Math.floor(Math.random() * 90 + 10).toString();

  
    this.RegistraVenta.idCaja = this.cashModel.idCaja;
   // this.RegistraVenta.fecha = new Date;
    this.RegistraVenta.noArticulos = this.articlesShell.length
    this.RegistraVenta.noTicket = year + month + day + randomTwoDigits;
    this.RegistraVenta.subtotal = this.total;
    this.RegistraVenta.tipoPago = tipoPago;
    this.RegistraVenta.tipoVenta = this.selectedOption.value 
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
        const fecha = this.RegistraVenta.fecha;


const dia = String(fecha.getDate()).padStart(2, '0');
const mes = String(fecha.getMonth() + 1).padStart(2, '0');
const anio = fecha.getFullYear();

const fechaFormateada = `${dia}/${mes}/${anio}`;
        //code Impresion
        const conector = new ConectorPluginV3();
        conector
          .Iniciar()
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
          .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/LogoSole.jpeg", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
          .Feed(1)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
          .EscribirTexto("Caja:" + this.cashModel.idCaja)
          .Feed(1)
          .EscribirTexto("Cajero:" + this.user.nombre)
          .Feed(1)
          .EscribirTexto("Fecha:" + fechaFormateada)
          .Feed(1)
          .EscribirTexto("Ticket:" + this.RegistraVenta.noTicket)
          .Feed(1)
          .EscribirTexto("Articulos:" + this.articulos)
          .Feed(1)
          .EscribirTexto("_________________________________________")
          .Feed(1)
          .EscribirTexto("ARTICULO        | CANT |  P/U  |  TOTAL  ")
          .Feed(1)
          .EscribirTexto("_________________________________________")
          .Feed(1)
          .EscribirTexto(this.cadenaProductos)
          .Feed(1)
          .EscribirTexto("_________________________________________")
          .Feed(1)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
          .EscribirTexto("Descuento:" + this.descuento + "MXN")
          .Feed(1)
          .EscribirTexto("Subtotal:" + this.RegistraVenta.subtotal + "MXN")
          .Feed(1)
          .EscribirTexto("Total:" + this.getDescuentoAplicado(this.total, this.descuento) + "MXN")
          .Feed(1)
          .EscribirTexto("Tipo Pago:" + this.getTotalmontoMultiple(this.RegistraVenta))
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
          .Feed(1)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
          .EscribirTexto("***GRACIAS POR SU PREFERENCIA***")
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
          .Feed(1)
          .EscribirTexto("***Venta publico Gral, Si requiere factura solicitarla durante la venta***")
          .Feed(1)
          .EscribirTexto("Suc. Frontera: 8666350209 Suc Monclova: 8666320215")
          // .Feed(2)
          .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
          .ImprimirCodigoDeBarrasCodabar(this.RegistraVenta.noTicket, 100, 2, 12)
          // .Feed(2)
          .Feed(3)
          .Corte(1)


        try {
          const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);

          if (respuesta == true) {
            this.isButtonDisabled = false; // Habilitar el botón al finalizar
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
            this.totalVenta = 0
            this.toastr.success(resp.mensaje, 'Exito!');
            console.log("Impresión correcta");
            this.display = false;
          } else {
            console.log("Error: " + respuesta);
          }

        } catch (error) {
          this.isButtonDisabled = false; // Habilitar el botón al finalizar
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
        this.isButtonDisabled = false; // Habilitar el botón al finalizar
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

  getTotalmontoMultiple(venta: VentaModel): string {
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

    if (this.totalVenta > this.total - this.descuento) {
      this.cambioVenta = Math.abs(this.total - this.totalVenta - this.descuento);


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


  onOptionChange(value: any): void {
    setTimeout(() => {
      if (this.selectedOption.value === 'VEN') {
        this.myInput.nativeElement.focus();
      }
    });

    this.total = 0;
    this.articlesShell = [];
    const option = localStorage.getItem('opcion');
    const op = JSON.parse(option);
    this.checked = false;
    this.articulos = 0;
    this.tiposDePago = [
      {
        id: 1,
        nombre: 'MOVIMIENTOS',
        descripcion: 'momientos de articulos',
        icon: 'pi pi-money-bill',
      },
      {
        id: 2,
        nombre: 'APARTADOS',
        descripcion: 'Pago con tarjeta',
        icon: 'pi pi-money-bill',
      },
    ];
    //console.log()
    if (op == value) {
      const ticket = localStorage.getItem('ticket');
      const articles = JSON.parse(ticket);
      this.articlesShell = articles;
      this.articlesShell.forEach((a) => {
        this.total += a.precio * a.cantidad;
        this.articulos += a.cantidad;
      });
    }
    //localStorage.setItem('ticket', JSON.stringify(this.articlesShell));
    if (value == 'VEN') {
      this.titlePay = 'PAGAR';
      this.iconPay = 'pi pi-money-bill';
      this.title = 'VENTA';
      this.cardStyle = {
        background: '#ffffff ', // Valor predeterminado
      };
      this.getTiposPago();
    } else if (value == 'ABN') {
      this.titlePay = 'ABONO';
      this.title = 'ABONO';
      this.iconPay = 'pi pi-wallet';
      this.cardStyle = {
        background: '#e1d9f1',
      };
    } else if (value == 'ENT') {
      this.titlePay = 'ENTRADA';
      this.title = 'ENTRADA DE EFECTIVO';
      this.iconPay = 'pi pi-upload';
      this.cardStyle = {
        background: '#fdfddc', // Valor predeterminado
      };
    } else if (value == 'DEV') {
      this.title = 'DEVOLUCION DE EFECTIVO';
      this.titlePay = 'DEVOLUCION';
      this.iconPay = 'pi pi-download';
      this.cardStyle = {
        background: '#d9d2e9', // Valor predeterminado
      };
    } else {
      this.title = 'SALIDA DE EFECTIVO';
      this.titlePay = 'SALIDA';
      this.iconPay = 'pi pi-download';
      this.cardStyle = {
        background: '#e2f6fd', // Valor predeterminado
      };
    }
    if (this.cashOpen == false) {
      this.toastr.warning(
        'Abre una caja para realizar movimientos',
        'Atencion!'
      );
    }
    //localStorage.setItem('opcion', JSON.stringify(value));
  }

    getTiposPago() {
    this.tiposDePago = [];
    this.ventasService.getTipoVenta().subscribe(
      (response) => {
        if (response.exito) {
          this.tiposDePago = response.respuesta;
        } else {
          //this.variablesGL.hideLoading();
          this.toastr.error(response.mensaje, 'Error!');
        }
      },
      (err) => {
        this.variablesGL.hideLoading();
        // this.toastr.error('Hubo un error al buscar cliente', 'Error!');
      }
    );
  }
  
  downloadPDF(tipo: String) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150],
    });

    const margenIzquierdo = 5;
    const espaciado = 5;

    const logoUrl = '/assets/img/logo_large_red.png';
    doc.addImage(logoUrl, 'PNG', margenIzquierdo, 5, 70, 20);

    doc.setFontSize(8);
    let posicionY = 30;
    doc.text(`${tipo}`, margenIzquierdo, posicionY);
    posicionY += espaciado;
    doc.text(`Caja: ${this.cashModel.idCaja}`, margenIzquierdo, posicionY);
    posicionY += espaciado;
    doc.text(`Cajero: ${this.user.nombre}`, margenIzquierdo, posicionY);
    posicionY += espaciado;
    doc.text(`Fecha: ${this.RegistraVenta.fecha}`, margenIzquierdo, posicionY);
    posicionY += espaciado;
    doc.text(
      `Ticket: ${this.RegistraVenta.noTicket}`,
      margenIzquierdo,
      posicionY
    );
    posicionY += espaciado;
    doc.text(`Artículos: ${this.articulos}`, margenIzquierdo, posicionY);
    posicionY += espaciado;

    doc.text('______________________________', margenIzquierdo, posicionY);
    posicionY += espaciado;

    doc.text('ARTICULO | CANT | P/U | TOTAL', margenIzquierdo, posicionY);
    posicionY += espaciado;
    doc.text('______________________________', margenIzquierdo, posicionY);
    posicionY += espaciado;

    doc.text(this.cadenaProductos, margenIzquierdo, posicionY);
    posicionY += espaciado * 3;

    doc.text(`Descuento: ${this.descuento} MXN`, margenIzquierdo, posicionY);
    posicionY += espaciado;
    doc.text(
      `Subtotal: ${this.RegistraVenta.subtotal} MXN`,
      margenIzquierdo,
      posicionY
    );
    posicionY += espaciado;
    doc.text(
      `Total: ${this.getDescuentoAplicado(this.total, this.descuento)} MXN`,
      margenIzquierdo,
      posicionY
    );
    posicionY += espaciado;
    doc.text(
      `Tipo Pago: ${this.getTotalmontoMultiple(this.RegistraVenta)}`,
      margenIzquierdo,
      posicionY
    );
    posicionY += espaciado;
    doc.text(`Cambio: ${this.cambioVenta} MXN`, margenIzquierdo, posicionY);
    posicionY += espaciado;

    doc.setFontSize(7);
    posicionY += espaciado;
    posicionY += espaciado * 2;
    doc.text(
      '***Venta público Gral, si requiere factura solicitarla durante la venta***',
      margenIzquierdo,
      posicionY,
      { maxWidth: 70 }
    );

    posicionY += espaciado * 2;
    posicionY += espaciado * 2;
    const totalEnLetras = this.variablesGL.numeroALetras(
      this.total - this.descuento,
      {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO',
      }
    );
    doc.text(totalEnLetras, margenIzquierdo, posicionY, { maxWidth: 70 });

    doc.save( `ticket${this.RegistraVenta.noTicket}.pdf `);
  }

  cancelMultiple() {
    //@ViewChild('myInput') myInput!: ElementRef;
    this.showMultiples = false;
    if (this.myInput != undefined) {
      this.myInput.nativeElement.focus();
    }
    this.getTiposPago();
  }

  
  addedInventario(precio: any) {
    this.selectedLista = precio;
    this.listaSelected = this.selectedLista.descripcion;
    localStorage.setItem('precios', JSON.stringify(precio));

    setTimeout(() => {
      this.variablesGL.showDialog.next(false);
    }, 100);
  }

  onClienteChange(event: any) {
    setTimeout(() => {
      this.myInput.nativeElement.focus();
    });
  }
  statusCaja(caja: CajaModel) {
    this.cashOpen = caja.estatus;
  }


}
