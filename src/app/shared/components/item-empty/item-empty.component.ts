import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-empty',
  templateUrl: './item-empty.component.html',
  styleUrls: ['./item-empty.component.css']
})
export class ItemEmptyComponent implements OnInit {

  textEmpty: string = "No hay información para mostrar";;
  constructor() { }

  ngOnInit(): void {
  }

}
