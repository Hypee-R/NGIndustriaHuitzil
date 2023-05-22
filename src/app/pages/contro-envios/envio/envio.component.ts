import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {
  visibleDialog: boolean;
  dialogSubscription: Subscription = new Subscription();

  constructor(private variablesGL: VariablesService,) {
    this.dialogSubscription = this.variablesGL.showDialog.subscribe(estado => {
      this.visibleDialog = estado;
  });
   }

  ngOnInit(): void {
  }

}
