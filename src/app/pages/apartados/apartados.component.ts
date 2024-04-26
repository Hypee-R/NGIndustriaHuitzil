
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

@Component({
  selector: 'app-apartados',
  templateUrl: './apartados.component.html',
  styleUrls: ['./apartados.component.css']
})
export class ApartadosComponent implements OnInit {
  statusPantalla: number
  selectedclienteNameAdvanced: CatClienteModel
  selectedApartado : CatApartadoModel
  loading: boolean = false
  filteredClients: CatClienteModel[] = []
  clientes: CatClienteModel[]
  cliente: CatClienteModel = new CatClienteModel();
  clienteName: string = ''
  listPagos : PagoApartado[] = []
  listArticulosApartados :  CatApartadoModel [] = []
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
  apartado : CatApartadoModel = new CatApartadoModel() 
  showPedidos = false
  submitted = false;
  nombreCompleto = ""
  nameCliente : String
  nameProducto : String
  hacerPago = true
  faltante : number = 0
  pagoApartado : PagoApartado = new PagoApartado()
  _apartado : CatApartadoModel = new CatApartadoModel();
  articulos = 0
  articulosApartados : ApartadoArticuloModel []= []
  articulosByApartado : productoModel []= []
  searchTerm: string = '';
  selectedClient : CatClienteModel;
  colsProducts:any[] = [];
  queryString: string = '';
  total = 0
  totalLetra = "";
  cashModel: CajaModel;
  accion = '';
  openCaja = true;
  sucursal =''
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private clientesService : ClientesService,
    private apartadoService : ApartadosService,
    private inventarioService : InventarioService,
    private ventasService: VentasService,
 
  ) {
    this.selectedArticuloAdvanced = new productoModel()
    this.selectedclienteNameAdvanced= new CatClienteModel() 
    this.statusPantalla = this.variablesGL.getStatusPantalla()
    this.cols = [
      { field: 'idArticulo', header: 'Articulo' },
      { field: 'talla', header: 'Talla' },
      { field : 'precio', header :'Precio'},
      { field: 'fecha', header: 'Fecha' },
      { field : 'fechaEntrega', header : 'Fecha Entrega'},
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'status', header : 'Status'}
    
    ];

    this.colsPagos = 

    [
      { field: 'idPagoApartado', header: 'ID PAGO' },
      { field: 'fecha',header:'FECHA PAGO'},
      { field: 'cantidad', header : 'CANTIDAD'}
    
    ];
    this.colsApartados = 

    [
      { field: 'idApartado', header: 'ID PEDIDO' },
      { field: 'cliente', header: 'CLIENTE' },
      { field: 'fecha',header:'FECHA APARTADO'},
      { field: 'status', header : 'STATUS'}
    
    ];

    this.colsProducts = [
      { field: 'sku', header: 'SKU' },
      { field: 'descripcion',header:'Producto'},
      { field: 'talla',header: 'Talla'},
      { field: 'existencia',header:'Existencia'}
      
    ];
    this.colSku = [
   
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'descripcion', header: 'PRODUCTO' },
      { field: 'precio', header: 'PRECIO' },
      { field: 'sku', header: 'SKU' }

    ];

    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
      this.rowsApartados = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
      this.rowsApartados = 6;
    }else if(status == 'laptop'){
      this.rows = 4;
      this.rowsApartados = 6;
    }else{
      this.rows = 7;
      this.rowsApartados = 12;
    }

    if(this.variablesGL.getSucursal()== null || this.variablesGL.getSucursal()== "null" ||this.variablesGL.getSucursal()== undefined||this.variablesGL.getSucursal()== ""){
      this.sucursal="all"
    }else{
      this.sucursal=this.variablesGL.getSucursal()
    }
  }

  ngOnInit(): void {
   
    this.getClientes()
    this.getApartados()
    this.getExistencias();
  }

  getApartados(){
    this.apartadoService.getApartadosByUbicacion().subscribe(response => {
      if(response.exito){
        this.allApartados = response.respuesta
      }
      else{
        this.toastr.error(response.mensaje, 'Error!');
      }
    },error =>{
      this.toastr.error('Hubo un error al buscar cliente', 'Error!');
    })
  }

  getClientes(){
    this.clientes= []
    this.clientesService.getClientes().subscribe(response => {
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

  getExistencias(){
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

  async showDetail(apartado: CatApartadoModel){
    this.hacerPago = apartado.resto != 0
    this.selectedApartado = apartado;
    this.pagoApartado = new PagoApartado()
    if(apartado.status != 'Entregado'){
      this.getCaja();
    }
    else{
      this.toastr.info('El apartado ya fue entregado', 'Aviso');
      //return;
    }
    await this.apartadoService.getArticuloByApartado(apartado.idApartado).subscribe(response =>{
      if(response.exito){
          this.articulosByApartado = response.respuesta
        }
      } 
    )
    await this.apartadoService.getPagoByApartado(apartado.idApartado).subscribe(response =>{
            if(response.exito){
              this.listPagos = response.respuesta
              this.showPagosPedido = true
            }
    })
  }

  entregarPedido(){
    this.selectedApartado.status = "Entregado"
    this.apartadoService.actualizaApartado(this.selectedApartado).subscribe(request =>{
      if(request.exito){
        this.toastr.success("Apartado Entregado","Aviso")
        this.showPagosPedido = false
        this.getApartados();
      }
      else{
        this.toastr.error(request.mensaje,"Error")
      }
    }, err => {
      this.variablesGL.hideLoading();
      this.toastr.error('Hubo un error al entregar el Apartado', 'Error!');
    });
    

  } 

  openAddPedido(){
    this.showNewReserve = true
    this.articulosApartados = []
    this.total= 0
    this.articulos = 0
    this.selectedClient = undefined
   
  }

  getResultsClients(event) {
    this.nameCliente = event.query
    if(event.query){
      this.filteredClients 
      = this.clientes.filter(cliente => {
          let name = cliente.nombre.toLocaleLowerCase() + " "+
           cliente.apellidoPaterno.toLocaleLowerCase() + " "+
           cliente.apellidoPaterno.toLocaleLowerCase()
           cliente.nombreCompleto = name
           if(name.includes(event.query.toLocaleLowerCase())){
            return cliente
           }
        }
      )
    }
    else{
      this.filteredClients = this.clientes
    }
  }

  addApartado(){
    if(this.articulosApartados.length == 0){
      this.toastr.warning('Selecciona al menos un articulo', 'Aviso!');
      return
    }
    if(this.selectedClient == undefined){
      this.toastr.warning('Selecciona un cliente', 'Aviso!');
      return
    }
    this.apartado.idCliente = this.selectedClient.idCliente
    this.apartado.articulosApartados = this.articulosApartados
    this.apartado.total = this.total
    this.apartado.resto = this.total
    this.apartado.fecha = new Date()
    this.apartado.ubicacion= this.sucursal
    this.apartado.type = "A"
   this.apartadoService.agregaApartado(this.apartado).subscribe(response =>{
          if(response.exito){
            this.hideDialog()
            this.toastr.success(response.mensaje, 'Sucess');
            this.getApartados();
          }
          else{
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

  async addPago(){
    this.submitted = true
    if(this.selectedApartado.resto == 0){
      this.toastr.warning('El apartado esta liquidado', 'Aviso');
      return
    }
    if(this.pagoApartado.fecha == undefined || this.pagoApartado.fecha == ""){
      this.toastr.warning('Selecciona una fecha', 'Aviso');
      return
    }
    if(this.pagoApartado.cantidad == 0){
      this.toastr.warning('La cantidad debe ser mayor a 0', 'Aviso');
      return
    }
    if(this.pagoApartado.cantidad > this.selectedApartado.resto){
      this.toastr.warning('La cantidad debe ser menor a '+ this.selectedApartado.resto, 'Aviso');
      return
    }
    this.pagoApartado.idApartado = this.selectedApartado.idApartado
    this.selectedApartado.resto -=this.pagoApartado.cantidad
    this.pagoApartado.idCaja = this.cashModel.idCaja
    await this.apartadoService.agregaPago(this.pagoApartado).subscribe(response =>{
      if(response.exito){
        this.apartadoService.actualizaApartado(this.selectedApartado).subscribe(request =>{
          if(request.exito){
            this.toastr.success('Abono realizado correctamente', 'Aviso');
            this.getPagos(this.selectedApartado)
            this.pagoApartado = new PagoApartado()
            this.submitted = false
          }
          else{
            this.toastr.error(request.mensaje,"Error")
          }
          
        }, err => {
          this.variablesGL.hideLoading();
          this.toastr.error('Hubo un error al entregar el Apartado', 'Error!');
        });

      }
      else{
        this.toastr.success(response.mensaje, 'Error!');
      }
  })
  }

  async getPagos(apartado: CatApartadoModel){
    this.listPagos = []
    await this.apartadoService.getPagoByApartado(apartado.idApartado).subscribe(response =>{
        if(response.exito){
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
    this.totalLetra = this.numeroALetras(this.total, {
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

  Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMillones = this.Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
    let strMiles = this.Miles(resto);

    if (strMillones == '')
      return strMiles;

    return strMillones + ' ' + strMiles;
  }

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
  }

  Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
    let strCentenas = this.Centenas(resto);

    if (strMiles == '')
      return strCentenas;

    return strMiles + ' ' + strCentenas;
  }

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
  }

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
  }

  DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + ' Y ' + this.Unidades(numUnidades)

    return strSin;
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
    if(this.articulosApartados.length === 0){
      let artc = new ApartadoArticuloModel()
      artc.descripcion = product.descripcion
      artc.precio = product.precio
      artc.cantidad = 1
      artc.sku = product.sku
      artc.idArticulo = product.idArticulo
      this.articulosApartados.push(artc)
      this.articulos += 1
      this.total += product.precio
      this.totalLetra = this.numeroALetras(this.total, {
        plural: 'PESOS MEXICANOS',
        singular: 'PESO MEXICANO',
        centPlural: 'CENTAVOS',
        centSingular: 'CENTAVO'
      });
      }
    else{
   
      let  busqueda  = this.articulosApartados.findIndex(producto => producto.idArticulo == product.idArticulo);
      if(busqueda == -1){
          let artc = new ApartadoArticuloModel()
          artc.descripcion = product.descripcion
          artc.precio = product.precio
          artc.cantidad = 1
          artc.sku = product.sku
          artc.idArticulo = product.idArticulo
          this.articulosApartados.push(artc)
          this.articulos += 1
          this.total += product.precio
          this.totalLetra = this.numeroALetras(this.total, {
            plural: 'PESOS MEXICANOS',
            singular: 'PESO MEXICANO',
            centPlural: 'CENTAVOS',
            centSingular: 'CENTAVO'
          });
      }
      else{
        this.addArticle(product,busqueda)
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
          /*if (this.accion == 'Abrir') {
            //console.log('No se puede abrir caja, hay una abierta...');
            this.toastr.info('Actualmente hay una caja abierta', 'Atención!');
            this.openCaja = true;
            return;
          }*/

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



        /*setTimeout(() => {
          this.variablesGL.showDialog.next(true);
        }, 100);*/


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
}
