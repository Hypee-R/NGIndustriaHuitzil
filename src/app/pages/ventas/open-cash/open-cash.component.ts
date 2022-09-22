import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatTallaModel } from 'src/app/models/tallas.model';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-open-cash',
  templateUrl: './open-cash.component.html',
  styleUrls: ['./open-cash.component.css']
})
export class OpenCashComponent implements OnInit {
  @Input() _accion: string;
  rows = 0;
  accion = '';
  dialogSubscription: Subscription = new Subscription();
  constructor(
    public variablesGL: VariablesService,
  ) { 

    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
      
      if(this._accion){
        this.accion = this._accion;
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
  submitted = false;
  visibleDialog = true;
  talla: CatTallaModel = new CatTallaModel();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.dialogSubscription){
      this.dialogSubscription.unsubscribe();
    }
}

}
