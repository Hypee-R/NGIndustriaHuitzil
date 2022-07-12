import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VariablesService } from '../../../services/variablesGL.service';

@Component({
  selector: 'app-side-user',
  templateUrl: './side-user.component.html',
  styleUrls: ['./side-user.component.css']
})

export class SideUserComponent implements OnInit {

  user: any;
  visibleAlertas: boolean = false;
  userSubcripcion: Subscription = new Subscription();

  constructor(
    private variablesGL: VariablesService
  ) {
   }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }

  logOff() {
    this.variablesGL.removeCredential();
  }
}
