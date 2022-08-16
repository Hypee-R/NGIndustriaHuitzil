import { Component, OnInit } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model.';
import { InventarioService } from 'src/app/services/inventario.service';
import { VariablesService } from 'src/app/services/variablesGL.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any;
  lineStylesData: any;

  chartOptions: any;

  basicOptions: any;

  statusPantalla: number;
  listArticulos:productoModel[]=[]
  loading: boolean = false;
  labels:string[]=[]
  colores:string[]=[]
  color = "#";
  simbolos = "0123456789ABCDEF"
  constructor(
    private inventarioService: InventarioService,
    private variablesService: VariablesService
    ) 
    {
    this.statusPantalla = this.variablesService.getStatusPantalla();

    }

  ngOnInit(): void {

    this.getArticulos()
    
    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };

  this.lineStylesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            tension: .4,
            borderColor: '#42A5F5'
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            borderDash: [5, 5],
            tension: .4,
            borderColor: '#66BB6A'
        },
        {
            label: 'Third Dataset',
            data: [12, 51, 62, 33, 21, 62, 45],
            fill: true,
            borderColor: '#FFA726',
            tension: .4,
            backgroundColor: 'rgba(255,167,38,0.2)'
        }
    ]
};
  }

  getArticulos(){
    this.loading = true;
    this.inventarioService.getArticulos().subscribe(response => {
      if(response.exito){
        this.listArticulos = response.respuesta;
        for (let articulo of this.listArticulos){
              this.labels.push(articulo.descripcion)
              
            this.color="#"
	        for(var i = 0; i < 6; i++){
		    this.color = this.color + this.simbolos[Math.floor(Math.random() * 16)];
	        }
            console.log(this.color)
            this.colores.push(this.color)
        }
        this.loading = false;
        
      }
      console.log(this.listArticulos)
    }, err => {
      this.loading = false;
    });


    this.data = {
        labels: this.labels,
        datasets: [
            {
                data: [30, 50, 40,50,40,30,20],
                backgroundColor: this.colores,
                hoverBackgroundColor: this.colores
            }
        ]
    };
  }
}
