import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatApartadoModel } from '../../../models/apartado.model';
import { ToastrService } from 'ngx-toastr';
import { VariablesService } from '../../../services/variablesGL.service';
import { InventarioService } from '../../../services/inventario.service';
import { TallasService } from '../../../services/tallas.service';
import { ApartadosService } from '../../../services/apartados.service';
import { PagoApartado } from 'src/app/models/pagoApartado';
import ConectorPluginV3 from "src/app/ConectorPluginV3";
@Component({
  selector: 'app-add-pago-apartado',
  templateUrl: './add-pago-apartado.component.html',
  styleUrls: ['./add-pago-apartado.component.css']
})
export class AddPagoApartadoComponent implements OnInit, OnChanges {

  //@Input() _accion: string;
  @Input() _listPagos: PagoApartado[]
  @Input() _apartado: CatApartadoModel;
  @Output() saveApartado: EventEmitter<boolean> = new EventEmitter<boolean>();
  impresoraSeleccionada: string = "Caja";
  submitted = false;
  visibleDialog: boolean;
  accion = '';
  dialogSubscription: Subscription = new Subscription();
  rows = 10;
  listPagos: PagoApartado[] = [];
  cols: any[] = [];
  pagoApartado: PagoApartado = new PagoApartado()
  selectedTalla: number
  totalAbonos: number
  hacerPago: boolean = true
  faltante: number = 0
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private inventarioService: InventarioService,
    private tallasService: TallasService,
    private apartadosService: ApartadosService

  ) {
    this.totalAbonos = 0
    this.listPagos = this._listPagos
    this.cols = [
      { field: 'idApartado', header: 'ID PAGO' },
      { field: 'sku', header: 'FECHA' },
      { field: 'descripcion', header: 'MONTO' },
    ];
    this.pagoApartado = new PagoApartado()
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
    });


  }

  consultarAbonos() {
    this.totalAbonos = 0
    this.faltante = 0
    this.listPagos = this._listPagos
    this._listPagos.forEach(pagos => {
      this.totalAbonos += pagos.cantidad
    });

    if (this.totalAbonos >= this._apartado.precio) {
      this.hacerPago = false
    }
    else {
      this.hacerPago = true
    }
    this.faltante = this._apartado.precio - this.totalAbonos
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.consultarAbonos()

  }
  ngOnInit(): void {
    this.consultarAbonos()
  }


  hideDialog() {
    /*this.listPagos = []
    this.submitted = false;
    this.pagoApartado = new PagoApartado()
    this.ngOnDestroy*/
  }

  addPago() {
    this.submitted = true
    if (this.pagoApartado.cantidad < this._apartado.precio && this.pagoApartado.fecha != "") {
      this.pagoApartado.idApartado = this._apartado.idApartado
      this.apartadosService.agregaPago(this.pagoApartado).subscribe(response => {
        if (response.exito) {
          this.toastr.success('Abono realizado', 'Sucess');
          this.getPagos()
          setTimeout(() => {

          }, 200);
        }
        else {
          this.toastr.success(response.mensaje, 'Error!');
        }
      })
    }
  }

  getPagos() {
    this.listPagos = []
    console.log(this._apartado.idApartado)
    this.apartadosService.getPagoByApartado(this._apartado.idApartado).subscribe(response => {
      if (response.exito) {
        this.listPagos = response.respuesta
        this.faltante = 0
        this.totalAbonos = 0
        this.listPagos.forEach(pagos => {
          this.totalAbonos += pagos.cantidad
        });

        if (this.totalAbonos >= this._apartado.precio) {
          this.hacerPago = false
        }
        else {
          this.hacerPago = true
        }
        this.faltante = this._apartado.precio - this.totalAbonos
      }
    }
    )
  }


  async geeneraTicket() {
    //code Impresion
    const conector = new ConectorPluginV3();
    conector
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
      .Feed(1)
      .EscribirTexto("***UniformesHuitzil***")
      .Feed(1)
      .EscribirTexto("Caja:" )
      .Feed(1)
      .EscribirTexto("Cajero:")
      .Feed(1)
      .EscribirTexto("Cliente:")
      .Feed(1)
      .EscribirTexto("Ticket:" )
      .Feed(1)
      .EscribirTexto("Articulos:" )

      .Feed(1)
      //.EscribirTexto("Total:" + this.total + "MXN")
      .Feed(2)
      // .EscribirTexto( this.numeroALetras(this.total - this.descuento, {
      //   plural: 'PESOS MEXICANOS',
      //   singular: 'PESO MEXICANO',
      //   centPlural: 'CENTAVOS',
      //   centSingular: 'CENTAVO'
      // }))
      .Feed(2)
      .EscribirTexto("***GRACIAS POR SU PREFERENCIA***")
      .Feed(2)
      .EscribirTexto("***Si requiere factura solo se podra expedir el dia de compra, de lo contrario se contemplara en ventas al Publico en General..***")
      .Feed(1)
      .EscribirTexto("Suc. Frontera: 8666350209 Suc Monclova: 8666320215")
      .Corte(1)
      .Iniciar()
      .Feed(1);

    try {
      const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);

      if (respuesta == true) {
        //Limpiar objetos al finalizar una compra correcta

        // this.toastr.success(resp.mensaje, 'Exito!');

      } else {
        console.log("Error: " + respuesta);
      }

    } catch (error) {
      console.log(error)
      // this.toastr.warning(error, 'Atencion!');
      //Limpiar objetos al finalizar una compra correcta



    }
  }

}
