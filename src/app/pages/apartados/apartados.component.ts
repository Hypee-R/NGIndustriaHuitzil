
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatApartadoModel } from 'src/app/models/apartado.model';
import { ApartadoArticuloModel } from 'src/app/models/apartadoArticulo.model';
import { CajaModel } from 'src/app/models/caja.model';
import { CatClienteModel } from 'src/app/models/clientes.model';
import { PagoApartado } from 'src/app/models/pagoApartado';
import { productoModel } from 'src/app/models/productos.model';
import { ApartadosService } from 'src/app/services/apartados.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';
import { formatDate } from '@angular/common';
import ConectorPluginV3 from "src/app/services/ConectorPluginV3";
import Swal from 'sweetalert2'
@Component({
  selector: 'app-apartados',
  templateUrl: './apartados.component.html',
  styleUrls: ['./apartados.component.css']
})
export class ApartadosComponent implements OnInit {
  statusPantalla: number
  selectedclienteNameAdvanced: CatClienteModel
  selectedApartado: CatApartadoModel
  loading: boolean = false
  filteredClients: CatClienteModel[] = []
  clientes: CatClienteModel[]
  cliente: CatClienteModel = new CatClienteModel();
  clienteName: string = ''
  listPagos: PagoApartado[] = []
  listArticulosApartados: CatApartadoModel[] = []
  listArticulos: productoModel[] = [];
  filteredArticulos: productoModel[] = []
  selectedArticuloAdvanced: productoModel
  cols: any[] = [];
  colsPagos: any[] = [];
  colSku: any[] = [];
  colsApartados = [];
  rows = 0;
  rowsApartados = 0
  allApartados = []
  selectedApartados = []
  showNewReserve = false
  showPagosPedido = false
  apartado: CatApartadoModel = new CatApartadoModel()
  showPedidos = false
  submitted = false;
  nombreCompleto = ""
  nameCliente: String
  nameProducto: String
  hacerPago = true
  faltante: number = 0
  pagoApartado: PagoApartado = new PagoApartado()
  _apartado: CatApartadoModel = new CatApartadoModel();
  articulos = 0
  articulosApartados: ApartadoArticuloModel[] = []
  articulosByApartado: productoModel[] = []
  searchTerm: string = '';
  selectedClient: CatClienteModel;
  colsProducts: any[] = [];
  queryString: string = '';
  total = 0
  totalLetra = "";
  cashModel: CajaModel;
  accion = '';
  openCaja = true;
  sucursal = ''
  impresoraSeleccionada: string = "Caja";
  cadenaProductos: string = "\n";
  tiposPago = [
    { label: 'Efectivo', value: 'EFECTIVO' },
    { label: 'Tarjeta', value: 'TARJETA' },
    { label: 'Múltiple', value: 'MULTIPLE' }
  ];
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private clientesService: ClientesService,
    private apartadoService: ApartadosService,
    private inventarioService: InventarioService,
    private ventasService: VentasService,

  ) {
    this.selectedArticuloAdvanced = new productoModel()
    this.selectedclienteNameAdvanced = new CatClienteModel()
    this.statusPantalla = this.variablesGL.getStatusPantalla()
    this.cols = [
      { field: 'idArticulo', header: 'Articulo' },
      { field: 'talla', header: 'Talla' },
      { field: 'precio', header: 'Precio' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'fechaEntrega', header: 'Fecha Entrega' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'status', header: 'Status' }

    ];

    this.colsPagos =

      [
        { field: 'tipoPagoValida', header: 'TIPO PAGO' },
        { field: 'montotarjeta', header: 'TARJETA' },
        { field: 'montoefectivo', header: 'EFECTIVO' },
        { field: 'fecha', header: 'FECHA PAGO' },
        { field: 'cantidad', header: 'MONTO' },
        { field: '', header: '' }
      ];
    this.colsApartados =

      [
        { field: 'idApartado', header: 'ID PEDIDO' },
        { field: 'cliente', header: 'TELEFONO' },
        { field: 'cliente', header: 'CLIENTE' },
        { field: 'fecha', header: 'FECHA APARTADO' },
        { field: 'status', header: 'STATUS' }

      ];

    this.colsProducts = [
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion', header: 'Producto' },
      { field: 'talla', header: 'Talla' },
      { field: 'existencia', header: 'Existencia' }

    ];
    this.colSku = [

      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'descripcion', header: 'PRODUCTO' },
      { field: 'precio', header: 'PRECIO' },
      { field: 'sku', header: 'SKU' }

    ];

    let status = this.variablesGL.getPantalla();
    if (status == 'celular') {
      this.rows = 6;
      this.rowsApartados = 6;
    } else if (status == 'tablet') {
      this.rows = 7;
      this.rowsApartados = 6;
    } else if (status == 'laptop') {
      this.rows = 4;
      this.rowsApartados = 6;
    } else {
      this.rows = 7;
      this.rowsApartados = 12;
    }


    this.sucursal = this.variablesGL.getSucursal()

  }

  ngOnInit(): void {

    this.getClientes()
    this.getApartados()
    this.getExistencias();
  }
  onTipoPagoChange(event) {
    console.log(event.value.value)
    this.pagoApartado.tipoPagoValida = event.value.value;
    this.pagoApartado.tipoPago = event.value;
  }
  sumarMontos(): number {
    console.info( this.pagoApartado.montoTarjeta+this.pagoApartado.montoEfectivo)
    // Calcula la suma de montoTarjeta y montoEfectivo si el tipo de pago es 'MULTIPLE'
     // Asegurarse de que montoTarjeta y montoEfectivo sean números válidos
  const montoTarjeta = isNaN(this.pagoApartado.montoTarjeta) ? 0 : this.pagoApartado.montoTarjeta;
  const montoEfectivo = isNaN(this.pagoApartado.montoEfectivo) ? 0 : this.pagoApartado.montoEfectivo;

  // Calcula la suma de montoTarjeta y montoEfectivo si el tipo de pago es 'MULTIPLE'
  if (this.pagoApartado.tipoPagoValida === 'MULTIPLE') {
    return montoTarjeta + montoEfectivo;
  } else {
    return 0;  // Devuelve 0 si no es tipo 'MULTIPLE'
  }
  }
  getApartados() {
    this.apartadoService.getApartadosByUbicacion().subscribe(response => {
      if (response.exito) {
        console.log(response)
        this.allApartados = response.respuesta
      }
      else {
        this.toastr.error(response.mensaje, 'Error!');
      }
    }, error => {
      this.toastr.error('Hubo un error al buscar cliente', 'Error!');
    })
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

  getExistencias() {
    this.inventarioService.getInexistencias().subscribe(response => {
      if (response.exito) {
        this.listArticulos = response.respuesta;

      } else {
        this.variablesGL.hideLoading();

        this.toastr.error(response.mensaje, 'Error!');
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo al obtener los articulos', 'Error!');
    });
  }

  async showDetail(apartado: CatApartadoModel) {
    this.hacerPago = apartado.resto != 0
    this.selectedApartado = apartado;
    this.pagoApartado = new PagoApartado()
    this.pagoApartado.fecha = new Date() // Asignar la fecha actual en formato YYYY-MM-DD
    if (apartado.status != 'Entregado') {
      this.getCaja();
    }
    else {
      this.toastr.info('El apartado ya fue entregado', 'Aviso');
      //return;
    }
    await this.apartadoService.getArticuloByApartado(apartado.idApartado).subscribe(response => {
      if (response.exito) {
        this.articulosByApartado = response.respuesta
      }
    }
    )
    await this.apartadoService.getPagoByApartado(apartado.idApartado).subscribe(response => {
      console.log(response)
      if (response.exito) {
        this.listPagos = response.respuesta
        this.showPagosPedido = true
      }
    })
  }

  entregarPedido() {
    this.selectedApartado.status = "Entregado"
    this.apartadoService.actualizaApartado(this.selectedApartado).subscribe(request => {
      if (request.exito) {
        console.info(request)
        this.toastr.success("Apartado Entregado", "Aviso")
        this.showPagosPedido = false
        this.getApartados();
      }
      else {
        this.toastr.error(request.mensaje, "Error")
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al entregar el Apartado', 'Error!');
    });


  }

  openAddPedido() {
    this.showNewReserve = true
    this.articulosApartados = []
    this.total = 0
    this.articulos = 0
    this.selectedClient = undefined

  }

  getResultsClients(event) {
    this.nameCliente = event.query
    if (event.query) {
      this.filteredClients
        = this.clientes.filter(cliente => {
          let name = cliente.nombre.toLocaleLowerCase() + " " +
            cliente.apellidoPaterno.toLocaleLowerCase() + " " +
            cliente.apellidoPaterno.toLocaleLowerCase()
          cliente.nombreCompleto = name
          if (name.includes(event.query.toLocaleLowerCase())) {
            return cliente
          }
        }
        )
    }
    else {
      this.filteredClients = this.clientes
    }
  }

  async addApartado() {
    if (this.articulosApartados.length == 0) {
      this.toastr.warning('Selecciona al menos un articulo', 'Aviso!');
      return
    }
    if (this.selectedClient === undefined ) {
      this.toastr.warning('Selecciona un cliente', 'Aviso!');
      return
    }
    if (this.selectedClient.idCliente===undefined || this.selectedClient.idCliente === 0 ) {
      this.toastr.warning('Selecciona un cliente', 'Aviso!');
      return
    }

    this.apartado.idCliente = this.selectedClient.idCliente
    this.apartado.articulosApartados = this.articulosApartados
    this.apartado.total = this.total
    this.apartado.resto = this.total
    this.apartado.fecha = new Date()
    this.apartado.ubicacion = this.sucursal
    this.apartado.type = "A"
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const formattedDate = formatDate(new Date, format, locale);
    this.apartado.noTicket = Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + Math.floor((Math.random() * (9 - 6 + 1)) + 6).toString() + formattedDate.replace(/(-)+/g, "").trim();;
    //console.info( "APARTADO CLIENTE",this.apartado)
    await this.apartadoService.agregaApartado(this.apartado).subscribe(response => {
      if (response.exito) {
        console.info(response)
        this.hideDialog()
        this.toastr.success(response.mensaje, 'Sucess');
        const respuestaValida = response.respuesta != null && response.respuesta !== '' ? response.respuesta :  this.apartado.noTicket;
        this.geeneraTicketApartado(this.apartado,respuestaValida);

        this.getApartados();
      }
      else {
        this.toastr.error(response.mensaje, 'Error!');
      }
    })
  }

  hideDialog() {
    this.submitted = false;
    this.cliente = new CatClienteModel();
    this.showNewReserve = false;
  }

  hideDialogPagos() {
    this.showPagosPedido = false
  }

  async addPago() {
    this.submitted = true
    if (this.selectedApartado.resto == 0) {
      this.toastr.warning('El apartado esta liquidado', 'Aviso');
      return
    }
    // if (this.pagoApartado.fecha == undefined ) {
    //   this.toastr.warning('Selecciona una fecha', 'Aviso');
    //   return
    // }
    if (this.pagoApartado.tipoPagoValida == "MULTIPLE") {
      this.pagoApartado.cantidad = this.pagoApartado.montoTarjeta + this.pagoApartado.montoEfectivo
    }
    if (this.pagoApartado.cantidad == 0) {
      this.toastr.warning('La cantidad debe ser mayor a 0', 'Aviso');
      return
    }

    if (this.pagoApartado.cantidad <= 0) {
      this.toastr.warning('La cantidad debe ser mayor que 0' + this.pagoApartado.cantidad, 'Aviso');
      console.error('La cantidad debe ser mayor que 0');
      return
      // Puedes lanzar un error, mostrar un mensaje al usuario, etc.
  }
    if(isNaN(this.pagoApartado.cantidad) ){
      this.toastr.warning('La cantidad debe ser mayor que 0', 'Aviso');
      console.error('La cantidad debe ser mayor que 0');
      return
    }
    this.pagoApartado.fecha =new Date
    this.pagoApartado.idApartado = this.selectedApartado.idApartado
    this.selectedApartado.resto -= this.pagoApartado.cantidad
    this.pagoApartado.idCaja = this.cashModel.idCaja

    this.pagoApartado.noTicketPago = Math.floor(1000 + Math.random() * 9000).toString();
    console.error(this.pagoApartado.cantidad);
    await this.apartadoService.agregaPago(this.pagoApartado).subscribe(response => {
      if (response.exito) {
        this.apartadoService.actualizaApartado(this.selectedApartado).subscribe(request => {
          if (request.exito) {
            this.toastr.success('Abono realizado correctamente', 'Aviso');
            this.geeneraTicketPago(this.pagoApartado);
            this.getPagos(this.selectedApartado)
            this.pagoApartado = new PagoApartado()
            this.submitted = false
          }
          else {
            this.toastr.error(request.mensaje, "Error")
          }

        }, err => {
          this.variablesGL.hideLoading();
          this.toastr.error('Hubo un error al entregar el Apartado', err);
        });

      }
      else {
        this.toastr.success(response.mensaje, 'Error!');
      }
    })
  }

  async getPagos(apartado: CatApartadoModel) {
    this.listPagos = []
    await this.apartadoService.getPagoByApartado(apartado.idApartado).subscribe(response => {
      if (response.exito) {
        this.listPagos = response.respuesta
      }
    }
    )
  }

  deleteProduct(product: ApartadoArticuloModel, index: number) {
    if (this.articulosApartados[index].cantidad > 1) {
      this.articulosApartados[index].cantidad -= 1
    }
    else {
      this.articulosApartados.splice(this.articulosApartados.indexOf(product), 1)
    }
    this.total -= product.precio
    this.articulos -= 1
  }

  addArticle(product: productoModel, index: number) {

    this.articulosApartados[index].cantidad += 1
    this.articulos += 1
    this.total += product.precio
    this.totalLetra = this.variablesGL.numeroALetras(this.total, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });
  }

  deleteArticle(product: ApartadoArticuloModel, index: number) {
    this.articulos -= product.cantidad;
    this.total -= (product.cantidad * product.precio)
    this.articulosApartados.splice(this.articulosApartados.indexOf(product), 1)
  }



  onAutoCompleteSelect(event) {
    this.articulosApartados = []

    if (event) {
      this.articulosApartados.push(event)
    }
  }


  onchangeShear() {
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


            this.toastr.success("Articulo agregado a la lista", 'Exito!');
            let artc = new productoModel()
            artc.descripcion = response.respuesta[0].descripcion
            artc.precio = response.respuesta[0].precio
            artc.talla = response.respuesta[0].talla
            artc.sku = response.respuesta[0].sku
            artc.idArticulo = response.respuesta[0].idArticulo
            artc.fechaIngreso = response.respuesta[0].fechaIngreso
            this.addProductApartado(artc);

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

  addProductApartado(product: productoModel) {
    if (this.articulosApartados.length === 0) {
      let artc = new ApartadoArticuloModel()
      artc.descripcion = product.descripcion
      artc.precio = product.precio
      artc.cantidad = 1
      artc.sku = product.sku
      artc.idArticulo = product.idArticulo
      this.articulosApartados.push(artc)
      this.articulos += 1
      this.total += product.precio
      this.totalLetra = this.variablesGL.numeroALetras(this.total, {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO'
      });
    }
    else {

      let busqueda = this.articulosApartados.findIndex(producto => producto.idArticulo == product.idArticulo);
      if (busqueda == -1) {
        let artc = new ApartadoArticuloModel()
        artc.descripcion = product.descripcion
        artc.precio = product.precio
        artc.cantidad = 1
        artc.sku = product.sku
        artc.idArticulo = product.idArticulo
        this.articulosApartados.push(artc)
        this.articulos += 1
        this.total += product.precio
        this.totalLetra = this.variablesGL.numeroALetras(this.total, {
          plural: 'PESOS MEXICANOS',
          singular: 'PESO MEXICANO',
          centPlural: 'CENTAVOS',
          centSingular: 'CENTAVO'
        });
      }
      else {
        this.addArticle(product, busqueda)
      }
    }
  }

  getCaja() {
    this.ventasService.getCaja().subscribe(resp => {
      //console.log('data vcaja ', resp);
      if (resp.exito) {
        this.cashModel = resp.respuesta;
        console.log(this.cashModel)
        console.log(this.accion)
        if (this.cashModel.fecha != null && this.cashModel.fechaCierre == null) {
          this.toastr.info('Actualmente hay una caja abierta', 'Atención!');


        } else if (this.cashModel.fecha != null && this.cashModel.fechaCierre != null) {

          this.openCaja = false;
          this.toastr.warning('La caja esta cerrada, Abrir una nueva', 'Aviso!');
          console.log(this.accion)
          if (this.accion == 'Abrir') {
            //console.log('Abrir caja...');
            this.cashModel = new CajaModel();
          } else if (this.accion == 'Cerrar') {
            // console.log('ya está cerrada la caja');
            this.toastr.info('Ya está cerrada la caja', 'Atención!');
            this.accion = 'Status';
          }
        }

      } else {

        if (this.accion == 'Abrir') {
          this.cashModel = new CajaModel();
          setTimeout(() => {
            this.variablesGL.showDialog.next(true);
          }, 100);
        } else {
          this.openCaja = false;
          this.toastr.info(resp.mensaje, 'Atención!');
        }

      }
    },
      err => {
        this.toastr.error('Error al obtener status de la caja', 'Error!');
        this.cashModel = new CajaModel();
      });
  }

  openCashRegister() {
    //this.openProducts = ""
    //this.accionAdd = ''
    this.accion = 'Abrir';
    this.getCaja();

  }

  async geeneraTicketPago(data: PagoApartado) {
    console.log(data)

    //code Impresion
    const conector = new ConectorPluginV3();
    conector
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
      .Feed(1)
      .EscribirTexto("***ABONO***")
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .Feed(1)
      .EscribirTexto("Fecha:" + data.fecha)
      .Feed(1)
      .EscribirTexto("Caja:" + data.idCaja)
      .Feed(1)
      .EscribirTexto("Ticket Abono:" + data.idApartado+'-'+data.noTicketPago)
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .Feed(1)
      .EscribirTexto("Tipo Pago:" + data.tipoPagoValida)
      .Feed(1)
      .EscribirTexto("Total:" + data.cantidad + "MXN")
      .Feed(2)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto(this.variablesGL.numeroALetras(data.cantidad, {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO'
      }))
      .Feed(3)
      .Corte(1)

    try {
      const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);

      if (respuesta == true) {
        this.toastr.success( 'Exito!');

      } else {
        console.log("Error: " + respuesta);
      }

    } catch (error) {
      console.log(error)
      this.toastr.warning(error, 'Atencion!');
      //Limpiar objetos al finalizar una compra correct

    }
  }
  deletePagoApartado(viewPago: PagoApartado){
    Swal.fire({
      title: `Eliminar el abono ${viewPago.noTicketPago} al por la cantidad ${viewPago.cantidad}?`,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {


        this.apartadoService.deletePago(viewPago).subscribe(response => {
          if(response.exito){
            this.getPagos(this.selectedApartado)
            this.selectedApartado.resto += viewPago.cantidad
            Swal.fire(response.mensaje, '', 'success');
          }
        });
      } else if (result.isDenied) {

      }
    })
  }


  async geeneraTicketApartado(data: CatApartadoModel,idApartadoCreado:number) {
    console.log(data.articulosApartados)
    data.articulosApartados.forEach(element => {
      element.subtotal = element.precio * element.cantidad; // Multiplica el precio por la cantidad
      this.cadenaProductos += element.descripcion + "|" + element.cantidad + "|" + "$" + element.precio + "MXN"  + "|" + "$" +  element.subtotal + "MXN" + "\n".toString()


    });

// Convertir la cadena de fecha a un objeto Date
const fecha = new Date(data.fecha);
// Formatear la fecha
const dia = String(fecha.getDate()).padStart(2, '0'); // Día con dos dígitos
const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos (Enero es 0)
const anio = fecha.getFullYear(); // Año con cuatro dígitos

// Construir la fecha formateada
const fechaFormateada = `${dia}/${mes}/${anio}`;
    //code Impresion
    const conector = new ConectorPluginV3();
    conector
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
      .Feed(1)
      .EscribirTexto("***APARTADO SUCURSAL***")
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto("Fecha:" + fechaFormateada)
      .Feed(1)
      .EscribirTexto("Cliente:"+data.idCliente)
      .Feed(1)
      .EscribirTexto("Tel Cliente:"+data.telefono)
      .Feed(1)
      .EscribirTexto("Ticket Apartado:" + idApartadoCreado)
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
      .EscribirTexto("Total:" + data.total + "MXN")
      .Feed(1)
      .EscribirTexto(this.variablesGL.numeroALetras(data.total, {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO'
      }))
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .EscribirTexto("***GRACIAS POR SU PREFERENCIA***")
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto("***Conserva este comprobante para la entrega de tu pedido***")
      .Feed(3)
      .Corte(1)
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
      .Feed(1)
      .EscribirTexto("***APARTADO CLIENTE***")
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto("Fecha:" + fechaFormateada)
      .Feed(1)
      .EscribirTexto("Cliente:"+data.idCliente)
      .Feed(1)
      .EscribirTexto("Tel Cliente:"+data.telefono)
      .Feed(1)
      .EscribirTexto("Ticket Apartado:" + idApartadoCreado)
      .EscribirTexto("_________________________________________")
      .Feed(1)
      .EscribirTexto("ARTICULO        | CANT |  P/U            ")
      .Feed(1)
      .EscribirTexto("_________________________________________")
      .Feed(1)
      .EscribirTexto(this.cadenaProductos)
      .Feed(1)
      .EscribirTexto("_________________________________________")
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
      .EscribirTexto("Total:" + data.total + "MXN")
      .Feed(1)
      .EscribirTexto(this.variablesGL.numeroALetras(data.total, {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO'
      }))
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .EscribirTexto("***GRACIAS POR SU PREFERENCIA***")
      .Feed(1)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto("***Conserva este comprobante para la entrega de tu pedido***")
      .Feed(3)
      .Corte(1)
    try {
      const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);

      if (respuesta == true) {
        this.toastr.success( 'Exito!');

      } else {
        console.log("Error: " + respuesta);
      }

    } catch (error) {
      console.log(error)
      this.toastr.warning(error, 'Atencion!');
      //Limpiar objetos al finalizar una compra correct

    }
  }

}
