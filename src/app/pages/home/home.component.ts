import { Component, OnInit } from '@angular/core';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  statusPantalla: number;
  constructor(
    private variablesService: VariablesService
  ) {
    this.statusPantalla = this.variablesService.getStatusPantalla();
  }

  ngOnInit(): void {
  }

}
