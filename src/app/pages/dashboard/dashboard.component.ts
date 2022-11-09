import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardModel } from 'src/app/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  statusPantalla: number;
  loading: boolean = false;
  dashboard: DashboardModel;
  constructor(
    private toastr: ToastrService,
    private dashboardService: DashboardService,
    private variablesService: VariablesService
  ){
    this.statusPantalla = this.variablesService.getStatusPantalla();

  }

  ngOnInit(): void {
    this.getDashboard();
  }

  getDashboard(){
    this.loading = true;
    this.dashboard = new DashboardModel();
    this.dashboardService.getDashboard().subscribe({
      next: (value) => {
        console.log(value);
        if(!value.cards.exito){
            this.toastr.error('Error al obtener las cards', 'Error!');
        }else{
            this.dashboard.cards = value.cards.respuesta;
        }

        if(!value.chartBar.exito){
            this.toastr.error('Error al obtener la grafica', 'Error!');
        }else{
            this.dashboard.barchart = value.chartBar.respuesta;
        }

        if(!value.rankingArticles.exito){
            this.toastr.error('Error al obtener el ranking de articulos', 'Error!');
        }else{
            this.dashboard.rankingA = value.rankingArticles.respuesta;
        }

        if(!value.rankingEmpleados.exito){
            this.toastr.error('Error al obtener el ranking de empleados', 'Error!');
        }else{
            this.dashboard.rankingE = value.rankingEmpleados.respuesta;
        }

        if(!value.rankingSucursales.exito){
            this.toastr.error('Error al obtener el ranking de sucursales', 'Error!');
        }else{
            this.dashboard.rankingS = value.rankingSucursales.respuesta;
        }

      },
      complete: () => {
        console.log('Completes with Success!');
        this.loading = false;
      },
    });
  }
}
