import { Component, OnInit } from '@angular/core';
import { VentaModel } from 'src/app/models/venta.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { VentaArticuloModel } from 'src/app/models/VentaArticulo.Model';
import { productoModel } from 'src/app/models/productos.model';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  statusPantalla: number;
  rows = 0;
  loading: boolean = false;
  ventas: VentaModel[] = [];
  selectedVentas : VentaModel
  cols: any[] = [];
  constructor(
    public variablesGL: VariablesService,
    private toastr: ToastrService,
    private ventasService : VentasService
  ) { 

    this.cols = [
      { fiel: 'idCaja', header: 'Caja' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'noTicket', header: 'N.Ticket' },
      { field: 'tipoPago', header: 'Tipo de pago' },
      { field: 'tipoVenta', header: 'Tipo de venta' },
      { field: 'noArticulos', header: 'N. Articulos' },
      { field: 'subtotal', header: 'Subtotal' },
      { field: 'total', header: 'Total' },

    ];
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
    this.getVentas();
  }

  getVentas() {
    this.loading = true;
    this.ventasService.getVentas().subscribe(response => {
      if(response.exito){
        console.log(response.respuesta)
        this.ventas = response.respuesta
        this.loading = false
      }
    }, err =>{
      this.loading = false
    })
  
  }

  Excel() {
    let total = 0
    let subtotal = 0
    let articulos = 0
    this.ventas.forEach(venta => {
      total += venta.total
      subtotal += venta.subtotal
      articulos += venta.noArticulos
    });
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ventas.map(row => ({
    idCaja:row.idCaja,
    Fecha:row.fecha,
    Nticket:row.noTicket,
    TipoPago : row.tipoPago,
    TipoVenta : row.tipoVenta,
    NoArticulos : row.noArticulos,
    Subtotal : row.subtotal,
    Total: row.total,
    
   })), { header: ['idCaja','Fecha','Nticket','TipoPago','TipoVenta','NoArticulos','Subtotal','Total'] })
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe de ventas');
    XLSX.utils.sheet_add_json(ws, [
      { Tola:"Totales " ,articulos : articulos,sub:subtotal,total: total}
    ], {header: ["Total"], skipHeader: true, origin:  { r: this.ventas.length+1, c: 3 }});
    XLSX.writeFile(wb, 'Informe_General_Ventas_'+new Date().toISOString()+'.csv',{compression : true})
    return this.toastr.success('Exportado con exito!!', 'Exito');
   }

   getArticulosVenta(ticket : string){
      let articulos : productoModel []= []
      let ventaConsulta :  VentaModel []
      this.ventasService.searchVentaByNoTicket(ticket).subscribe(response => {
        if(response.exito){
          ventaConsulta = response.respuesta
          if(ventaConsulta[0].ventaArticulo.length != 0){
          ventaConsulta[0].ventaArticulo.forEach(ventas => {
            articulos.push(ventas.articulo)
          })
        }
        if(articulos.length !=0){
          this.ExcelIndividual(articulos.sort((a,b) =>{return a.idArticulo - b.idArticulo}),ticket)
        }
          console.log(articulos)
         
        }
      })

    
   }

   ExcelIndividual(articulos: productoModel[],ticket: String){

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(articulos.map(row => ({
      Id : row.idArticulo,
      Descripcion : row.descripcion,
      SKU : row.sku,
      Precio : row.precio,
      Talla : row.talla,
      Unidad : row.unidad,
      Ubicacion : row.ubicacion,
      FechaIngreso : row.fechaIngreso

    
   })), { header: ['Id','Descripcion','SKU','Precio','Talla','Unidad','Ubicacion','FechaIngreso'] })
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe de ventas');
    XLSX.writeFile(wb, 'Informe_Venta_'+ticket+new Date().toISOString()+'.csv',{compression : true})
    return this.toastr.success('Exportado con exito!!', 'Exito');
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
    })
  }
}
