import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import ConectorPluginV3 from 'src/app/services/ConectorPluginV3';
import { CajaModel } from 'src/app/models/caja.model';
import { VentaModel } from 'src/app/models/venta.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from '../../../services/ventas.service';
import { ApartadosService } from 'src/app/services/apartados.service';

@Component({
  selector: 'app-open-cash',
  templateUrl: './open-cash.component.html',
  styleUrls: ['./open-cash.component.css']
})
export class OpenCashComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('usuario'));
  impresoraSeleccionada: string = "Caja";
  @Input() _accion: string;
  @Input() _caja: CajaModel;
  rows = 0;
  accion = '';
  submitted = false;
  visibleDialog = true;
  fecha: Date;
  fechaCierre: Date;
  motivo;
  openCashModel: CajaModel = new CajaModel();
  dialogSubscription: Subscription = new Subscription();
  datePipe = new DatePipe("en-US");
  //Valores que se utilizan para mostrar totales
  totalVentas;
  totalApartadosPagos;
  totalEfectivodata;
  totalTarjetadata;
  totalMultipledata;
  //Valores que se utilizan para ticket separados y ventas
  //ventas
  totalEfectivo = 0;
  totalTarjeta = 0;
  totalMultiple
  //separados
  totalApartados = 0;
  totalEfectivoAbonos = 0;
  totalTarjetaAbonos = 0;
  totalMultipleAbonos
  //Valores que se utilizan para ticket separados y ventas
  ventas: VentaModel[] = [];
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private ventasService: VentasService,
    private apartadosService: ApartadosService
  ) {

    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;

      if (this.visibleDialog) {
        if (this._accion) {
          this.accion = this._accion;
        }
        if (this._caja) {
          this.openCashModel = this._caja;
          console.log(this.openCashModel.fecha)
          this.fecha = this.openCashModel.fecha != '' ? this.variablesGL.getFormatoFecha(this.openCashModel.fecha) : new Date();
          this.GetInformacionCaja()

          if (this.accion == 'Cerrar') {
            console.log("Cierre")
            this.fechaCierre = new Date();
          }
          if (this.accion == 'Status') {
            console.log("STATUS")
            console.log(this.openCashModel.idCaja)
            this.fechaCierre = this.openCashModel.fechaCierre != null ? this.variablesGL.getFormatoFecha(this.openCashModel.fechaCierre) : new Date();

          }
        }
      }
    });

    let status = this.variablesGL.getPantalla();
    if (status == 'celular') {
      this.rows = 6;
    } else if (status == 'tablet') {
      this.rows = 7;
    } else if (status == 'laptop') {
      this.rows = 5;
    } else {
      this.rows = 11;
    }
  }

  ngOnInit(): void {
    console.log(this.user.ubicacion)

  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  hideDialog() {
    this.submitted = false;
    this.openCashModel = new CajaModel();
    this.variablesGL.showDialog.next(false);
  }

  saveCaja() {
    this.submitted = true;
    if (this.accion == 'Abrir' && this.openCashModel.monto > 0) {
      this.openCashModel.fecha = this.fecha ? this.variablesGL.setFormatoFecha(this.fecha) : '';
      this.ventasService.openCaja(this.openCashModel).subscribe(response => {
        console.log(response);
        if (response.exito) {
          this.toastr.success(response.mensaje, 'Exito!');
          this.submitted = false;
          this.variablesGL.showDialog.next(false);
        } else {
          this.toastr.info(response.mensaje, 'Atención!')
        }
      },
        err => {
          console.log('error -> ', err);
          this.toastr.error('Ocurrió un error al hacer la operación', 'Error!');
        });
    } else if (this.accion == 'Cerrar' && this.openCashModel.montoCierre > 0) {

      console.log(this.fechaCierre)
      console.log(this.variablesGL.setFormatoFecha(this.fecha))
      if (this.fechaCierre > this.fecha) {

        this.openCashModel.fechaCierre = this.fechaCierre ? this.variablesGL.setFormatoFecha(this.fechaCierre) : '';
        console.log(this.openCashModel)

        this.ventasService.closeCaja(this.openCashModel).subscribe(response => {
          console.log(response);
          if (response.exito) {
            this.toastr.success(response.mensaje, 'Exito!');
            this.submitted = false;
            this.variablesGL.showDialog.next(false);
            this.impresionCierreCaja()
          } else {
            this.toastr.info(response.mensaje, 'Atención!')
          }
        },
          err => {
            console.log('error -> ', err);
            this.toastr.error('Ocurrió un error al hacer la operación', 'Error!');
          });
      } else {
        this.toastr.error('La fecha de cierre debe ser posterior a la fecha que se abrió la caja', 'Error');
      }
      // }


    }
  }

  //TODO validar el tiket nuevamente con los datos de mejora como nombre del cajero etc
  //Impresion del cierre del status de la caja
  async impresionCierreCaja() {
    //code Impresion
    const conector = new ConectorPluginV3();
    conector
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .Feed(1)
      .EscribirTexto("*CIERRE CAJA*")
      .Feed(1)
      .EscribirTexto("Suc:" + this.user.ubicacion)
      .Feed(1)
      .EscribirTexto("Empleado:" + this.user.nombre)
      .Feed(1)
      .EscribirTexto("Abrio Caja:" + this.openCashModel.fecha)
      .EscribirTexto("Cerro Caja:" + this.openCashModel.fechaCierre)
      .Feed(1)
      .EscribirTexto("____________________________")
      .Feed(1)
      .EscribirTexto("Apertura :" + this.openCashModel.monto)
      .Feed(1)
      .EscribirTexto("Total registro:$ " +  this.totalEfectivoAbonos+this.totalEfectivo)
      .Feed(1)
      .EscribirTexto("Total caja:$ " + this.openCashModel.montoCierre)
      .Feed(1)
      .EscribirTexto("Diferencia:" + this.calcularDiferencia())
      .Feed(1)
      .EscribirTexto("____________________________")
      .Feed(1)
      .EscribirTexto("VENTAS" + "__" + "$TOTAL:" + this.totalVentas)
      .Feed(1)
      .EscribirTexto("Ventas EFE:" + this.totalEfectivo)
      .EscribirTexto("Ventas TAR:" + this.totalTarjeta)
      .Feed(1)
      .EscribirTexto("SEPARADOS" + "__" + "$TOTAL:" +  this.totalApartadosPagos )
      .Feed(1)
      .EscribirTexto("Abonos EFE:" + this.totalEfectivoAbonos)
      .EscribirTexto("Abonos TAR:" + this.totalTarjetaAbonos)
      .Feed(1)
      .EscribirTexto("*Recuerda conservar este ticket para tu respaldo al cierre de tu caja en buen estado *")
      .Feed(4)
      .Corte(1)
    try {
      const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);
      // const respuesta = true;

      if (respuesta == true) {
        //Limpiar objetos al finalizar una compra correcta

        console.log("Impresión correcta");

      } else {
        console.log("Error: " + respuesta);
      }

    } catch (error) {
      this.toastr.warning("Se Realizo el cierre correctamente pero no se encontro la impresora:TicketsZebraSistema", 'Atencion!');

    }
  }
  calcularDiferencia(): number {
    return this.totalEfectivoAbonos + this.totalEfectivo - this.openCashModel.montoCierre;
  }
  async GetInformacionCaja() {

    this.ventasService.getVentasByCaja(this.openCashModel.idCaja).subscribe(response => {
      if (response.exito) {
        console.log(response.respuesta);
        this.ventas = response.respuesta;

        let total = 0;
        let totalEfectivo = 0;
        let totalTarjeta = 0;
        let totalMultiple = 0;

        let totalApartados = 0;
        let totalEfectivoAbonos = 0;
        let totalTarjetaAbonos = 0;
        let totalMultipleAbonos = 0;

        response.respuesta.forEach(function (a) {
          if (a.status == "CONCLUIDA") {
            total += a.total;
          }

          if (a.tipoPago == "TARJETA" && a.status == "CONCLUIDA") {
            totalTarjeta += a.total;
          }

          if (a.tipoPago == "EFECTIVO" && a.status == "CONCLUIDA") {
            totalEfectivo += a.total;
          }

          if (a.tipoPago == "MULTIPLE" && a.status == "CONCLUIDA") {
            totalTarjeta += a.tarjeta;
            totalMultiple += a.total;
            totalEfectivo += a.efectivo;
          }
        });

        this.apartadosService.getPagoByCaja(this.openCashModel.idCaja).subscribe(response => {
          if (response.exito) {
            response.respuesta.forEach(function (a) {
              console.log(a);

              totalApartados += a.cantidad;

              if (a.tipoPagoValida == "TARJETA") {
                totalTarjetaAbonos += a.cantidad;
              }

              if (a.tipoPagoValida == "EFECTIVO") {
                totalEfectivoAbonos += a.cantidad
              }

              if (a.tipoPagoValida == "MULTIPLE") {
                totalTarjetaAbonos += a.montoTarjeta;
                totalMultipleAbonos += a.cantidad;
                totalEfectivoAbonos += a.montoEfectivo;
              }
            });

            // Mover las asignaciones aquí, después de que ambas respuestas han sido procesadas
            this.totalVentas = total;
            this.totalEfectivodata = totalEfectivo+totalEfectivoAbonos;
            this.totalTarjetadata = totalTarjeta+totalTarjetaAbonos;
            this.totalMultipledata = totalMultiple+totalMultipleAbonos;
            //valores individuales
            this.totalEfectivo = totalEfectivo;
            this.totalTarjeta = totalTarjeta;
            this.totalMultiple=totalMultiple
            //separados
           //this.totalApartados = 0;
            this. totalEfectivoAbonos = totalEfectivoAbonos;
            this.totalTarjetaAbonos = totalTarjetaAbonos;
            this.totalMultipleAbonos=totalMultipleAbonos

            this.totalApartadosPagos = totalApartados;
          }
        });
      }
    });


  }


}
