import { Component, OnInit } from '@angular/core';
import { VentaModel } from 'src/app/models/venta.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { VentasService } from 'src/app/services/ventas.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { productoModel } from 'src/app/models/productos.model';
import { CajaModel } from 'src/app/models/caja.model';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
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
  cajas : CajaModel[] = []
  selectedVentas : VentaModel
  cols: any[] = [];
  fechaI;
  fechaF;
  dateFormat: string = 'dd/mm/yy'; // Ajusta el formato de fecha según sea necesario
  openModal = ''
  constructor(
    public variablesGL: VariablesService,
    private toastr: ToastrService,
    private ventasService : VentasService,
    private http: HttpClient
  ) {

    this.cols = [
      { field : 'N de caja', header:'N de caja'},
      { field: 'usuario', header: 'Empleado'},
      {field:'x',header:'Ubicación'},
      { field: 'fecha', header: 'Fecha' },
      {field: 'fechaCierre',header:'Fecha Cierre'},
      {field: 'monto',header:'Monto'},
      {field: 'montoCierre',header: 'Monto Cierre'}


    ];
    this.statusPantalla = this.variablesGL.getStatusPantalla();
    let status = this.variablesGL.getPantalla();
    if(status == 'celular'){
      this.rows = 6;
    }else if(status == 'tablet'){
      this.rows = 7;
    }else if(status == 'laptop'){
      this.rows = 7;
    }else{
      this.rows = 11;
    }

  }

  ngOnInit(): void {
    this.setDefaultDates();
    this.getCajas()
  }
  setDefaultDates() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.fechaI = this.formatDate(lastMonth);
    this.fechaF = this.formatDate(endOfMonth);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  getVentas() {
    this.loading = true;
    this.ventasService.getVentas().subscribe(response => {
      if(response.exito){
        this.ventas = response.respuesta
        this.loading = false
      }
    }, err =>{
      this.loading = false
    })

  }


  getCajas() {
    this.loading = true;
    if(this.fechaF != undefined && this.fechaI != undefined){
      if(this.fechaI > this.fechaF){
        this.toastr.error('La fecha inicial debe ser menor a la final!!', 'Fechas incorrectas');
      }
      else{


        this.ventasService.getallVentasCajasDate(this.fechaI,this.fechaF).subscribe(response =>{
    // this.ventasService.getallCajas().subscribe(response => {
      if(response.exito){
        console.log(response.respuesta)
        this.cajas = response.respuesta
        this.loading = false
      }
    }, err =>{
      this.loading = false
    })
  }}
  }

  SearchByDates(){
    if(this.fechaF != undefined && this.fechaI != undefined){
      if(this.fechaI > this.fechaF){
        this.toastr.error('La fecha inicial debe ser menor a la final!!', 'Fechas incorrectas');
      }
      else{


        this.ventasService.getallVentasCajasDate(this.fechaI,this.fechaF).subscribe(response =>{
          if(response.exito){

            if(response.respuesta.length != 0){
              this.cajas = response.respuesta
              this.toastr.warning('Ventas Consultadas...', '!!!');
              //this.GenerateExcel()
            }
            else{
              this.toastr.warning('No hay ventas esas fechas',"Error");
              this.getVentas()
            }

        }
      })
      }
    }
    else{
      this.toastr.warning('Selecciona una fecha valida',"Error");
    }

  }

  Excel() {
      this.toastr.warning('Descargando reporte de  ventas...', '!!!');
      this.GenerateExcel()
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

   getVentasBycaja(idCaja : number){
    this.openModal = 'ventas'
    this.ventasService.getVentasByCaja(idCaja).subscribe(response => {
        if(response.exito){
          this.ventas = response.respuesta
          console.log(response.respuesta)
        }
        setTimeout(() => {
          this.variablesGL.showDialog.next(true);
        }, 100);
      }
    )
   }


   GenerateReport() {
    let totalMontoCierre = 0;

    // Mapea las filas de las cajas
    const rows = this.cajas.map(row => ({
      Caja: row.idCaja,
      Usuario: row.idEmpleadoNavigation.nombre,
      Ubicacion: row.idEmpleadoNavigation.ubicacion,
      Fecha: row.fecha,
      FechaCierre: row.fechaCierre,
      MontoApertura: "$" + row.monto + "MXN",
      MontoCierre: "$" + row.montoCierre + "MXN",
      TotalVentas: ''
    }));

    // Calcula el total de MontoCierre
    this.cajas.forEach(venta => {
      totalMontoCierre += venta.montoCierre - 1000;
    });

    // Añade una fila adicional con la suma de MontoCierre
    rows.push({
      Caja: 0,
      Usuario: '',
      Ubicacion: '',
      Fecha: '',
      FechaCierre: '',
      MontoApertura: '',
      MontoCierre: '',
      TotalVentas: "$" + totalMontoCierre.toString() + "MXN"
    });

    // Crear el documento PDF
    const doc = new jsPDF();

    // Convertir el logo a Base64 y añadirlo al PDF
    this.getBase64ImageFromUrl('assets/img/logo_huitzil.png').then(base64Image => {
      doc.addImage(base64Image, 'PNG', 10, 10, 50, 20); // Ajusta la posición y tamaño según sea necesario

      // Añadir el título
      const title = `Reporte de Cajas\nDesde: ${this.fechaI ? new Date(this.fechaI).toLocaleDateString() : 'N/A'} Hasta: ${this.fechaF ? new Date(this.fechaF).toLocaleDateString() : 'N/A'}`;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 70, 20); // Ajusta la posición según sea necesario

      // Añadir la tabla
      autoTable(doc, {
        startY: 40, // Ajusta la posición de inicio de la tabla
        head: [['Caja', 'Usuario', 'Ubicacion', 'Fecha', 'FechaCierre', 'MontoApertura', 'MontoCierre', 'TotalVentas']],
        body: rows.map(row => [
          row.Caja,
          row.Usuario,
          row.Ubicacion,
          row.Fecha ? new Date(row.Fecha).toLocaleString() : '',
          row.FechaCierre ? new Date(row.FechaCierre).toLocaleString() : '',
          row.MontoApertura,
          row.MontoCierre,
          row.TotalVentas
        ]),
        margin: { top: 30 },
        styles: { cellPadding: 2 },
        headStyles: {
          fillColor:  [115, 128, 236], // Usa la variable del color
          textColor: [255, 255, 255], // Color del texto de los encabezados
          fontStyle: 'bold'
        }
      });

      // Guardar el PDF
      doc.save('Informe_General_Ventas_' + new Date().toISOString() + '.pdf');

      return this.toastr.success('Exportado con éxito!!', 'Éxito');
    }).catch(error => {
      console.error('Error al cargar la imagen:', error);
      this.toastr.error('Error al cargar el logo', 'Error');
    });
  }



   GenerateExcel() {
    let totalMontoCierre = 0;

    // Mapea las filas de las cajas
    const rows = this.cajas.map(row => ({
      Caja: row.idCaja,
      Usuario: row.idEmpleadoNavigation.nombre,
      Ubicacion: row.idEmpleadoNavigation.ubicacion,
      Fecha: row.fecha,
      FechaCierre: row.fechaCierre,
      MontoApertura: row.monto,
      MontoCierre: row.montoCierre,
      TotalVentas: ''
    }));

    // Calcula el total de MontoCierre
    this.cajas.forEach(venta => {
      totalMontoCierre += venta.montoCierre-1000;

    });

    // Añade una fila adicional con la suma de MontoCierre
    rows.push({
      Caja: 0,
      Usuario: '',
      Ubicacion: '',
      Fecha: '',
      FechaCierre: '',
      MontoApertura: 0,
      MontoCierre: 0,
      TotalVentas:"$"+totalMontoCierre.toString()+"MXN"
    });

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows, { header: ['Caja', 'Usuario', 'Ubicacion', 'Fecha', 'FechaCierre', 'MontoApertura', 'MontoCierre','TotalVentas'] });

    // Estilo de los encabezados
    const headerRange = XLSX.utils.decode_range(ws['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!ws[address]) continue;
      ws[address].s = {
        font: {
          bold: true,
          color: { rgb: "FFFFFF" }
        },
        fill: {
          fgColor: { rgb: "4F81BD" } // Color de fondo
        }
      };
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe de ventas');
    XLSX.writeFile(wb, 'Informe_General_Ventas_' + new Date().toISOString() + '.xlsx', { compression: true });

    return this.toastr.success('Exportado con éxito!!', 'Éxito');
  }

   ExcelIndividual(articulos: productoModel[],ticket: String){

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(articulos.map(row => ({
      Id : row.idArticulo,
      Descripcion : row.descripcion,
      SKU : row.sku,
      Precio : row.precio,
      Talla : row.talla,
      Status : row.status,
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
