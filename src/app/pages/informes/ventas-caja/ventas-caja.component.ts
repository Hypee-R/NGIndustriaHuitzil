import { Component, OnInit,Input,SimpleChanges} from '@angular/core';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { VentaModel } from 'src/app/models/venta.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ToastrService } from 'ngx-toastr';
import { CambiosDevolucionesModel } from 'src/app/models/cambios-devoluciones.model';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from "jspdf";
import { ApartadosService } from 'src/app/services/apartados.service';
@Component({
  selector: 'app-ventas-caja',
  templateUrl: './ventas-caja.component.html',
  styleUrls: ['./ventas-caja.component.css']
})
export class VentasCajaComponent implements OnInit {
  @Input() _listVentas : VentaModel[]
  statusPantalla: number;
  visibleDialog: boolean;
  dialogSubscription: Subscription = new Subscription();
  ventas: VentaModel[] = [];
  lstCambiosDevoluciones: CambiosDevolucionesModel[]=[];
  rows = 0;
  cols: any[] = [];
  loading: boolean = false;
  constructor(private variablesGL: VariablesService, private toastr: ToastrService,private http: HttpClient,    private apartadosService: ApartadosService) {

    this.cols = [
      { fiel: 'noTicket', header: 'TICKET' },
      { field: 'tipoPago', header: 'TIPO DE P.'},
      { field: 'tipoVenta', header: 'TIPO DE V.' },
      {field: 'fecha',header:'FECHA'},
      {field: 'noArticulos',header:'NoArticulos'},
      {field: 'efectivo',header:'EFECTIVO'},
      {field: 'efectivo',header:'TARJETA'},
      {field: 'subtotal',header:'SUBTOTAL'},
      {field: 'total',header: 'TOTAL'},
      {field: 'status',header: 'STATUS'}

    ];

    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;

      }
    );

    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 10;
    }else if(status == 'tablet'){
      this.rows = 10;
    }else if(status == 'laptop'){
      this.rows = 10;
    }else{
      this.rows = 10;
    }
   }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ventas = this._listVentas
    console.log(this.ventas)
    //this.lstCambiosDevoluciones=this._listVentas
    //console.log( this._listVentas)


  }




PdfIndividual() {
    // Primero, obtenemos los datos de ventas
    const rows = this.ventas.map(venta => ({
        Ticket: venta.noTicket,
        TipoPago: venta.tipoPago,
        TipoVenta: venta.tipoVenta,
        Fecha: venta.fecha,
        NoArticulo: venta.noArticulos,
        Subtotal: "$" + venta.subtotal.toFixed(2) + " MXN",
        Total: "$" + venta.total.toFixed(2) + " MXN"
    }));

    // Calcular el total de las ventas
    const totalVentas = this.ventas.reduce((sum, venta) => sum + venta.total, 0).toFixed(2);

    // Calcular el total por tipo de pago
    const totalPorTipoPago: { [key: string]: number } = this.ventas.reduce((totals, venta) => {
        totals[venta.tipoPago] = (totals[venta.tipoPago] || 0) + venta.total;
        return totals;
    }, {});

    // Llamar al servicio para obtener los datos de abonos
    this.apartadosService.getPagoByCaja(this.ventas[0].idCaja).subscribe(response => {
        if (response.exito) {
            let totalApartados = 0;
            let totalTarjetaAbonos = 0;
            let totalEfectivoAbonos = 0;
            let totalMultipleAbonos = 0;

            response.respuesta.forEach(a => {
                totalApartados += a.cantidad;

                if (a.tipoPagoValida === "TARJETA") {
                    totalTarjetaAbonos += a.cantidad;
                }

                if (a.tipoPagoValida === "EFECTIVO") {
                    totalEfectivoAbonos += a.cantidad;
                }

                if (a.tipoPagoValida === "MULTIPLE") {
                    totalTarjetaAbonos += a.montoTarjeta;
                    totalMultipleAbonos += a.cantidad;
                    totalEfectivoAbonos += a.montoEfectivo;
                }
            });

            // Crear el documento PDF
            const doc = new jsPDF();

            // Convertir el logo a Base64 y añadirlo al PDF
            this.getBase64ImageFromUrl('assets/img/only_logo_huitzil.png').then(base64Image => {
                doc.addImage(base64Image, 'PNG', 10, 10, 25, 20); // Ajusta la posición y tamaño según sea necesario

                // Añadir el título
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text('Informe de Ventas por Caja', 50, 20); // Título principal, ajusta la posición según sea necesario

                // Añadir el subtítulo
                doc.setFontSize(14);
                doc.setFont('helvetica', 'normal');
                const subtitle = `Caja: ${this.ventas[0].idCaja}\nFecha Generacion: ${new Date().toLocaleString()}`;
                doc.text(subtitle, 50, 30); // Subtítulo, ajusta la posición según sea necesario

                // Añadir el total por tipo de pago debajo del subtítulo
                let startY = 40;
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                for (const [tipoPago, total] of Object.entries(totalPorTipoPago)) {
                    doc.text(`${tipoPago}: $${total.toFixed(2)} MXN`, 50, startY);
                    startY += 10; // Incrementa la posición Y para el siguiente tipo de pago
                }

                // Añadir el total general de las ventas
                doc.setFontSize(14);
                doc.text(`Total de Ventas: $${totalVentas} MXN`, 50, startY + 10);

                // Añadir la tabla de ventas
                (doc as any).autoTable({
                    startY: startY + 20, // Ajusta la posición de inicio de la tabla
                    head: [['Ticket', 'TipoPago', 'TipoVenta', 'Fecha', 'NoArticulo', 'Subtotal', 'Total']],
                    body: rows.map(row => [
                        row.Ticket,
                        row.TipoPago,
                        row.TipoVenta,
                        row.Fecha.toString(),
                        row.NoArticulo,
                        row.Subtotal,
                        row.Total
                    ]),
                    margin: { top: 30 },
                    styles: { cellPadding: 2 },
                    headStyles: {
                        fillColor: [115, 128, 236], // Color Primario
                        textColor: [255, 255, 255], // Color del texto de los encabezados
                        fontStyle: 'bold'
                    }
                });

                // Añadir la tabla de abonos apartados
                const abonosData = [
                    ['TipoPago Abonos', 'Cantidad'],
                    ['TARJETA', `$${totalTarjetaAbonos.toFixed(2)} MXN`],
                    ['EFECTIVO', `$${totalEfectivoAbonos.toFixed(2)} MXN`],
                    ['MULTIPLE', `$${totalMultipleAbonos.toFixed(2)} MXN`],
                    ['TOTAL APARTADOS', `$${totalApartados.toFixed(2)} MXN`]
                ];

                (doc as any).autoTable({
                    startY: (doc as any).autoTable.previous.finalY + 10, // Posición de inicio de la nueva tabla
                    head: [['TipoPago Abonos', 'Cantidad']],
                    body: abonosData,
                    margin: { top: 30 },
                    styles: { cellPadding: 2 },
                    headStyles: {
                        fillColor:[85, 98, 206], // Color Primario
                        textColor: [255, 255, 255], // Color del texto de los encabezados
                        fontStyle: 'bold'
                    }
                });

                // Guardar el PDF
                doc.save('Informe_Venta_' + new Date().toISOString() + '.pdf');

                return this.toastr.success('Exportado con éxito!!', 'Éxito');
            }).catch(error => {
                console.error('Error al cargar la imagen:', error);
                this.toastr.error('Error al cargar el logo', 'Error');
            });
        } else {
            this.toastr.error('Error al obtener los abonos', 'Error');
        }
    });
}



  ExcelIndividual(){

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ventas.map(venta => ({
      Ticket : venta.noTicket,
      TipoPago: venta.tipoPago,
      TipoVenta: venta.tipoVenta,
      Fecha: venta.fecha,
      NoArticulo: venta.noArticulos,
      Subtotal : venta.subtotal,
      Total : venta.total

   })), { header: ['Ticket','TipoPago','TipoVenta','Fecha','NoArticulo','Subtotal','Total'] })
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe de ventas');
    XLSX.writeFile(wb, 'Informe_Venta_'+new Date().toISOString()+'.csv',{compression : true})
    return this.toastr.success('Exportado con exito!!', 'Exito');
   }

   getBase64ImageFromUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'blob' }).subscribe(
        (data: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64);
          };
          reader.onerror = error => reject(error);
          reader.readAsDataURL(data); // Convierte Blob a Base64
        },
        error => reject(error)
      );
    });
  }

}
