import { Component, OnInit } from '@angular/core';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  statusPantalla: number;
  constructor(
    private variablesService: VariablesService
  ) {
    this.statusPantalla = this.variablesService.getStatusPantalla();
  }

  ngOnInit(): void {
  }

}
