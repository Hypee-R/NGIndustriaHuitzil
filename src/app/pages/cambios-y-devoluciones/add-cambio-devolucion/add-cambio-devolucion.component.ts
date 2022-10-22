import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CambiosDevolucionesModel } from '../../../models/cambios-devoluciones.model';
import { Subscription } from 'rxjs';
import { VariablesService } from '../../../services/variablesGL.service';

@Component({
  selector: 'app-add-cambio-devolucion',
  templateUrl: './add-cambio-devolucion.component.html',
  styleUrls: ['./add-cambio-devolucion.component.css']
})
export class AddCambioDevolucionComponent implements OnInit {
  @Input() _accion: string;
  @Input() _details: CambiosDevolucionesModel;
  @Output() saveCambioDevolucion: EventEmitter<boolean> = new EventEmitter<boolean>();

  accion: string;
  visibleDialog: boolean;
  dialogSubscription: Subscription;
  constructor(
    private variablesGL: VariablesService
  ) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
      if(this._details){
        // this.producto = this._editproducto;
      }
      if(this._accion){
        this.accion = this._accion;
      }
    });
  }

  ngOnInit(): void {
  }

}
