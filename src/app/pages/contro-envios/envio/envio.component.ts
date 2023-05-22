import { Component, OnInit ,Input, SimpleChange} from '@angular/core';
import { Subscription } from 'rxjs';
import { CambiosDevolucionesModel } from 'src/app/models/cambios-devoluciones.model';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {
  @Input() _movimiento : CambiosDevolucionesModel;
  visibleDialog: boolean;
  dialogSubscription: Subscription = new Subscription();
  submitted = false;
  movimiento: CambiosDevolucionesModel = new CambiosDevolucionesModel();
  constructor(private variablesGL: VariablesService,) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
  });
  //if(this._movimiento){
    this.movimiento = this._movimiento
    
   // this.nombreCompleto = this.cliente.nombre + " " + this.cliente.apellidoPaterno + " " + this.cliente.apellidoMaterno
  //}
   }
   ngOnChanges(changes: SimpleChange): void {
    this.movimiento = this._movimiento
    ///this.consultarAbonos()
   
  }
  ngOnInit(): void {
    console.log(this.movimiento)
  }

  hideDialog() {
    this.submitted = false;
    this.variablesGL.showDialog.next(false);
  }
}
