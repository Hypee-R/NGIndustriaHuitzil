import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-contro-envios',
  templateUrl: './contro-envios.component.html',
  styleUrls: ['./contro-envios.component.css']
})
export class ControEnviosComponent implements OnInit {
  statusPantalla: number
  list1: any[];

  list2: any[];

  
  constructor( private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    // this.list1 = //initialize list 1
    //   this.list2 = //initialize list 2
  }

}
