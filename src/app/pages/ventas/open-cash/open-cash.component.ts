import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import ConectorPluginV3 from 'src/app/ConectorPluginV3';
import { CajaModel } from 'src/app/models/caja.model';
import { VentaModel } from 'src/app/models/venta.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from '../../../services/ventas.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-open-cash',
  templateUrl: './open-cash.component.html',
  styleUrls: ['./open-cash.component.css']
})
export class OpenCashComponent implements OnInit {
  impresoraSeleccionada: string = "TicketsZebraSistema";
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
  totalVentas;
  totalEfectivodata;
  totalTarjetadata;
  totalMultipledata;
  ventas: VentaModel[] = [];
  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private ventasService: VentasService,
  ) {

    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;

      if(this.visibleDialog){
        if(this._accion){
          this.accion = this._accion;
        }
        if(this._caja){
          this.openCashModel = this._caja;
          console.log(this.openCashModel.fecha)
          this.fecha = this.openCashModel.fecha != '' ? this.variablesGL.getFormatoFecha(this.openCashModel.fecha) : new Date();
          if(this.accion == 'Cerrar'){
            this.fechaCierre =  new Date();

            this.ventasService.getVentasByCaja(this.openCashModel.idCaja).subscribe(response => {
              if(response.exito){
                console.log(response.respuesta)
                this.ventas = response.respuesta
               
                let total=0
                let totalEfectivo=0
                let totalTarjeta=0
                let totalMultiple=0
                response.respuesta.forEach(function(a){
                  
                  total += a.total;
                  if(a.tipoPago=="TARJETA"){
                    totalTarjeta +=a.total

                  }

                  if(a.tipoPago=="EFECTIVO"){
                    totalEfectivo +=a.total

                  }

                  if(a.tipoPago=="MULTIPLE"){
                    totalMultiple +=a.total

                  }

                
                });
                console.log(total);

                this.totalVentas=total;
                this.totalEfectivodata=totalEfectivo
               this. totalTarjetadata=totalTarjeta
               this. totalMultipledata=totalMultiple
              }

           
        
            })
          }

        //  if(this.openCashModel.montoCierre != null && this.accion == 'Status'){
          if( this.accion == 'Status'){
            console.log("STATUS")
            console.log(this.openCashModel.idCaja)
            this.fechaCierre = this.openCashModel.fechaCierre != null ? this.variablesGL.getFormatoFecha(this.openCashModel.fechaCierre) : new Date();

            this.ventasService.getVentasByCaja(this.openCashModel.idCaja).subscribe(response => {
              if(response.exito){
                console.log(response.respuesta)
                this.ventas = response.respuesta
               
                let total=0
                let totalEfectivo=0
                let totalTarjeta=0
                let totalMultiple=0
                response.respuesta.forEach(function(a){
                  
                  total += a.total;
                  if(a.tipoPago=="TARJETA"){
                    totalTarjeta +=a.total

                  }

                  if(a.tipoPago=="EFECTIVO"){
                    totalEfectivo +=a.total

                  }

                  if(a.tipoPago=="MULTIPLE"){
                    totalMultiple +=a.total

                  }

                
                });
                console.log(total);

                this.totalVentas=total;
                this.totalEfectivodata=totalEfectivo
               this. totalTarjetadata=totalTarjeta
               this. totalMultipledata=totalMultiple
              }

           
        
            })
          }

          
        }
      }
    });

    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 5;
    }else{
      this.rows = 11;
    }
  }

  ngOnInit(): void {

    
  }

  ngOnDestroy(): void {
    if(this.dialogSubscription){
      this.dialogSubscription.unsubscribe();
    }
  }

  hideDialog() {
    this.submitted = false;
    this.openCashModel = new CajaModel();
    this.variablesGL.showDialog.next(false);
  }

  saveCaja(){
    this.submitted = true;
    if(this.accion == 'Abrir' && this.openCashModel.monto > 0){
      console.log('Agregar');
      this.openCashModel.fecha = this.fecha ? this.variablesGL.setFormatoFecha(this.fecha) : '';


        this.ventasService.openCaja(this.openCashModel).subscribe(response => {
            console.log(response);
            if(response.exito){
                this.toastr.success(response.mensaje, 'Exito!');
                this.submitted = false;
                this.variablesGL.showDialog.next(false);
            }else{
                this.toastr.info(response.mensaje, 'Atención!')
            }
        },
        err => {
          console.log('error -> ', err);
          this.toastr.error('Ocurrió un error al hacer la operación','Error!');
        });
    }else if(this.accion == 'Cerrar' && this.openCashModel.montoCierre > 0){
      // if(this.openCashModel.monto+this.totalVentas!=this.openCashModel.montoCierre){
      //   this.toastr.warning("Hay una Diferencia en el cierre escribe el motivo", 'Diferencia!');
       


      // }else{

      console.log(this.fechaCierre)
      console.log(this.variablesGL.setFormatoFecha(this.fecha))
        if(this.fechaCierre > this.fecha){
          console.log('Actualizar');
          this.openCashModel.fechaCierre = this.fechaCierre ? this.variablesGL.setFormatoFecha(this.fechaCierre) : '';
          console.log(this.openCashModel)
  
  
          this.ventasService.closeCaja(this.openCashModel).subscribe(response => {
            console.log(response);
            if(response.exito){
                this.toastr.success(response.mensaje, 'Exito!');
                this.submitted = false;
                this.variablesGL.showDialog.next(false);
                //Impresion del Status de la caja
             
                this.impresionCierreCaja()
              }else{
                this.toastr.info(response.mensaje, 'Atención!')
            }
          },
          err => {
            console.log('error -> ', err);
            this.toastr.error('Ocurrió un error al hacer la operación','Error!');
          });
        }else{
          this.toastr.error('La fecha de cierre debe ser posterior a la fecha que se abrió la caja', 'Error');
        }
     // }

     
    }
  }

  //Impresion del cierre del status de la caja
  async impresionCierreCaja(){
  //code Impresion
  const conector = new ConectorPluginV3();
  conector
    .Iniciar()
    .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
    .DescargarImagenDeInternetEImprimir("https://huitzil.netlify.app/assets/img/logo_huitzil.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
    .Feed(1)
    .EscribirTexto("*Apertura y Cierre de caja*")
    .Feed(1)
    .EscribirTexto("Caja:"+this.openCashModel.idCaja)
    .Feed(1)
    .EscribirTexto("*Empleado:"+this.openCashModel.idEmpleado)
    .Feed(1)
    .EscribirTexto("Abrio Caja:"+this.openCashModel.fecha)
    .EscribirTexto("con el monto de :"+this.openCashModel.monto)
    .Feed(1)
    .EscribirTexto("Total con Tarjeta:"+this.totalTarjetadata)
    .EscribirTexto("Total Efectivo:"+this.totalEfectivodata)
    .EscribirTexto("Total Multiple:"+this.totalEfectivodata)
    .EscribirTexto("Total Ventas:"+this.totalVentas)
    .Feed(1)
    .EscribirTexto("Cerro Caja:"+this.openCashModel.fechaCierre)
    .EscribirTexto("con el monto de :"+this.openCashModel.monto+this.totalVentas)
    .Feed(1)
    .EscribirTexto("*Recuerda conservar este ticket para tu respaldo al cierre de tu caja en buen estado *")
    .Feed(1)
    .Corte(1)
    .Iniciar()
    .Feed(1);
    try{
      const respuesta = await conector.imprimirEn(this.impresoraSeleccionada);
     // const respuesta = true;

      if (respuesta == true) {
        //Limpiar objetos al finalizar una compra correcta

        console.log("Impresión correcta");

      } else {
        console.log("Error: " + respuesta);
      }

    }catch (error) {
      this.toastr.warning("Se Realizo el cierre correctamente pero no se encontro la impresora:TicketsZebraSistema", 'Atencion!');

    }
  }
}
