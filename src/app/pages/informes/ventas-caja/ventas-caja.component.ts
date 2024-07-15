import { Component, OnInit,Input,SimpleChanges} from '@angular/core';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { productoModel } from 'src/app/models/productos.model';
import { VentaModel } from 'src/app/models/venta.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ToastrService } from 'ngx-toastr';
import { CambiosDevolucionesModel } from 'src/app/models/cambios-devoluciones.model';
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
  constructor(private variablesGL: VariablesService, private toastr: ToastrService) {

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
    //this.consultarAbonos()

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



}
