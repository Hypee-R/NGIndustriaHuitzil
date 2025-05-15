
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
import { PrimeNGConfig } from 'primeng/api';
import { jsPDF } from "jspdf";
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
  accionAdd = '';
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
    private primengConfig: PrimeNGConfig,
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
        { field: 'fecha', header: 'FECHA LEVANTAMIENTO' },
        { field: 'fechaEntrega', header: 'Fecha Entrega' },
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
  es: any;
  ngOnInit(): void {
    this.primengConfig.setTranslation({
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
                   "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago",
                        "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Limpiar',
      // otros textos opcionales
    });
  
    this.getClientes()
    this.getApartados()
    this.getExistencias();

  }
  getResultsClients(event) {
    let filtered: CatClienteModel[] = [];
  let query = event.query.toLowerCase(); // Asegúrate de que la consulta está en minúsculas

  for (let i = 0; i < this.clientes.length; i++) {
    let cliente = this.clientes[i];

    // Verifica si 'nombreCompleto' o 'nombre' están definidos antes de llamar a 'toLowerCase'
    let nombreCompleto = (cliente.nombreCompleto || (cliente.nombre || '') + ' ' + (cliente.apellidoPaterno || '') + ' ' + (cliente.apellidoMaterno || '')).toLowerCase();


    if (nombreCompleto.indexOf(query) === 0) {
      filtered.push(cliente);
    }
  }

    this.filteredClients = filtered;

    console.log('Filtered clients:', this.filteredClients);
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

  onClienteSaved(cliente: CatClienteModel) {
    console.log('Cliente guardado:', cliente);
    cliente.nombreCompleto= (cliente.nombreCompleto || (cliente.nombre || '') + ' ' + (cliente.apellidoPaterno || '') + ' ' + (cliente.apellidoMaterno || '')).toLowerCase();
    this.selectedClient = cliente;

  // Asegúrate de que el cliente esté en la lista de clientes
  if (!this.clientes.find(c => c.idCliente === cliente.idCliente)) {
    this.clientes.push(cliente);
  }
  // Actualiza filteredClients para incluir el cliente guardado
  this.filteredClients = [...this.clientes];
  // Filtra los clientes para incluir el cliente guardado
  this.filteredClients = this.filteredClients.filter(c => {
    // Forma el nombre completo del cliente c
    const nombreCompletoCliente = `${c.nombre || ''} ${c.apellidoPaterno || ''} ${c.apellidoMaterno || ''}`.toLowerCase();
    // Forma el nombre completo del cliente guardado
    const nombreCompletoGuardado = cliente.nombreCompleto?.toLowerCase() || '';
    // Asegúrate de que nombreCompletoCliente esté definido antes de llamar a toLowerCase
    return nombreCompletoCliente.includes(nombreCompletoGuardado);
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
    this.apartado.fecha = new Date()
   
  }



  async addApartado() {

    console.log(this.selectedClient)
    
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
    if(this.apartado.vendedor===undefined || this.apartado.vendedor===null|| this.apartado.vendedor===''){

      this.toastr.warning('Agrega Vendedor', 'Aviso!');
      return
    }

    if(this.apartado.fechaEntrega===undefined || this.apartado.fechaEntrega===null|| this.apartado.fechaEntrega===''){

      this.toastr.warning('Selecciona fecha de entrega', 'Aviso!');
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
        this.generaTicketApartadoPDF(this.apartado,respuestaValida);
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
            // artc.talla = response.respuesta[0].talla
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
    this.accionAdd = ''
    this.accion = 'Abrir';
    this.getCaja();

  }

  openModalAdd(){
    this.accion = ''
    this.accionAdd = "Agregar"

    setTimeout(() => {
      this.variablesGL.showDialog.next(true);
    }, 100);
  }

  async geeneraTicketPago(data: PagoApartado) {
    console.log(data)
   
    const lineCount =
  15 + // líneas fijas (fecha, cajero, etc.)
  2 +  // total y letras (pueden ser multilínea)
  2 +  // restante y letras
  2;   // mensaje final

const height = 10 + lineCount * 5; // margen + 5mm por línea aprox.

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: [58, height],
});
    const marginLeft = 5;
    let cursorY = 10;
  
    const fecha = new Date(data.fecha);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
  
    const textoEnLetras = this.variablesGL.numeroALetras(data.cantidad, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO',
    });
  
    const textoRestanteLetras = this.variablesGL.numeroALetras(this.selectedApartado.resto, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO',
    });
  

  
    const margen = 5;
    let y = 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
  
    const margenIzquierdo = 5;
 
    const margenSuperior = 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const logoUrl = '/assets/img/LogoSole.jpeg';
const logoHeight = 20;
const logoWidth = 50;

// Insertar logo en la parte superior
doc.addImage(logoUrl, 'PNG', margenIzquierdo, margenSuperior, logoWidth, logoHeight);

// Asegurarte de que el texto no se ensime con el logo
cursorY = margenSuperior + logoHeight + 2; // espacio de 2 mm debajo del logo

// Continúa con el contenido
doc.setFont('helvetica', 'bold');
doc.text("***ABONO***", 29, cursorY, { align: 'center' });
cursorY += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(7);
doc.text(`Fecha: ${fechaFormateada}`, marginLeft, cursorY); cursorY += 4;
doc.text(`Caja: ${data.idCaja}`, marginLeft, cursorY); cursorY += 4;

doc.text(`Ticket Abono: ${data.idApartado}-${data.noTicketPago}`, marginLeft, cursorY); cursorY += 4;
doc.text(`Tipo de Pago: ${data.tipoPagoValida}`, marginLeft, cursorY); cursorY += 6;

// Total y letras
doc.text(`Total: $${Number(data.cantidad).toFixed(2)} MXN`, marginLeft, cursorY); cursorY += 4;
doc.text(doc.splitTextToSize(textoEnLetras, 50), marginLeft, cursorY); cursorY += 8;

// Restante y letras
doc.text(`Restante: $${Number(this.selectedApartado.resto).toFixed(2)} MXN`, marginLeft, cursorY); cursorY += 4;
doc.text(doc.splitTextToSize(textoRestanteLetras, 50), marginLeft, cursorY); cursorY += 10;

// Mensaje final
doc.setFont("helvetica", "bold");
doc.setFontSize(9);
doc.text("***Gracias por su preferencia***", 29, cursorY, { align: 'center' });


   
      doc.autoPrint(); // Para impresión automática

      window.open(doc.output('bloburl'), '_blank');
   
   
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

  deleteApartado(viewPago: CatApartadoModel){
    Swal.fire({
      title: `Cancelar el Apartado: ${viewPago.idApartado} ?`,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'cancelar Apartado',
      denyButtonText: `Cerrar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.apartadoService.cancelaApartado(viewPago).subscribe(response => {
          if(response.exito){
            this.getApartados()

            Swal.fire(response.mensaje, '', 'success');
          }
        });
      } else if (result.isDenied) {
        //Swal.fire('No se cancelo el ap', '', 'success');
      }
    })
  }


  async generaTicketApartadoPDF(data: CatApartadoModel, idApartadoCreado: number) {

    const fecha = new Date(data.fecha);
const dia = String(fecha.getDate()).padStart(2, '0');
const mes = String(fecha.getMonth() + 1).padStart(2, '0');
const anio = fecha.getFullYear();
const horas = String(fecha.getHours()).padStart(2, '0');
const minutos = String(fecha.getMinutes()).padStart(2, '0');
const fechaFormateada = `${dia}/${mes}/${anio} ${horas}:${minutos}`;

const fecha1 = new Date(data.fechaEntrega);
const dia1 = String(fecha1.getDate()).padStart(2, '0');
const mes1 = String(fecha1.getMonth() + 1).padStart(2, '0');
const anio1 = fecha1.getFullYear();
const horas1 = String(fecha1.getHours()).padStart(2, '0');
const minutos1 = String(fecha1.getMinutes()).padStart(2, '0');
const fechaFormateadaEntrega = `${dia1}/${mes1}/${anio1} ${horas1}:${minutos1}`;
  
    const productos = data.articulosApartados.map(el => ({
      ...el,
      subtotal: el.precio * el.cantidad
    }));
  
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [58, 200 + productos.length * 12],
    });
  
    const margen = 5;
    let y = 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
  
    const margenIzquierdo = 5;
 
    const margenSuperior = 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const logoUrl = '/assets/img/LogoSole.jpeg';

     // Reducción del tamaño del logo para que se ajuste al ancho de 58 mm
     //doc.addImage(logoUrl, 'PNG', margenIzquierdo, margenSuperior, 50, 20); // Ajustar el tamaño del logo
     doc.text('***SOLE***', 29, y, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('***APARTADO***', 29, y, { align: 'center' });
    y += 6;
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Fecha Apartado: ${fechaFormateada}`, margen, y); y += 4;
    doc.text(`Fecha Entrega: ${fechaFormateadaEntrega}`, margen, y); y += 4;
    doc.text(`Cliente: ${data.idCliente}`, margen, y); y += 4;
    
    doc.text(`Nombre: ${this.selectedClient.nombre+this.selectedClient.apellidoPaterno+this.selectedClient.apellidoMaterno}`, margen, y); y += 4;
    doc.text(`Teléfono: ${data.telefono}`, margen, y); y += 4;
    doc.text(`Ticket: ${idApartadoCreado}`, margen, y); y += 4;
  
    doc.line(margen, y, 53, y); y += 3;
    doc.setFont('helvetica', 'bold');
    doc.text('ARTÍCULO', margen, y);
    doc.text('CANT', 30, y);
    doc.text('P/U', 40, y);
    doc.text('TOTAL', 50, y);
    y += 3;
    doc.line(margen, y, 53, y); y += 3;
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    productos.forEach(prod => {
      const nombre = doc.splitTextToSize(prod.descripcion, 28);
      doc.text(nombre, margen, y);
      doc.text(prod.cantidad.toString(), 30, y);
      doc.text(`$${prod.precio}`, 40, y);
      doc.text(`$${prod.subtotal}`, 50, y);
      y += nombre.length * 3;
    });
  
    doc.line(margen, y, 53, y); y += 4;
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${data.total} MXN`, 53, y, { align: 'right' }); y += 4;
  
    const totalEnLetras = this.variablesGL.numeroALetras(data.total, {
      plural: 'PESOS MEXICANOS',
      singular: 'PESO MEXICANO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });
    const letras = doc.splitTextToSize(totalEnLetras, 48);
    doc.text(letras, margen, y);
    y += letras.length * 3;
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('***GRACIAS POR SU PREFERENCIA***', 29, y, { align: 'center' }); y += 4;
    doc.text('***Conserva este comprobante para la entrega de tu pedido***', margen, y);
  
    doc.autoPrint(); // Para impresión automática

    window.open(doc.output('bloburl'), '_blank');

    this.apartado.fechaEntrega=null
    this.apartado.vendedor=null
    //Limpiar objetos al finalizar una compra correct
     this.cadenaProductos = ""
  }



}
