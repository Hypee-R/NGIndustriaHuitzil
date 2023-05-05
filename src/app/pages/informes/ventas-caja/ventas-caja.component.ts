import { Component, OnInit,Input,SimpleChanges} from '@angular/core';
import { Subscription } from 'rxjs';
import { VentaModel } from 'src/app/models/venta.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
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
  rows = 0;
  cols: any[] = [];
  constructor(private variablesGL: VariablesService,) {

    this.cols = [
      { fiel: 'noTicket', header: 'TICKET' },
      { field: 'tipoPago', header: 'TIPO DE P.'},
      { field: 'tipoVenta', header: 'TIPO DE V.' },
      {field: 'fecha',header:'FECHA'},
      {field: 'noArticulos',header:'NoArticulos'},
      {field: 'subtotal',header:'SUBTOTAL'},
      {field: 'total',header: 'TOTAL'}

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
    //console.log(this.ventas)
    //this.consultarAbonos()
   
  }

}
