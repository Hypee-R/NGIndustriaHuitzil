import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardModel } from 'src/app/models/dashboard.model';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { UbicacionModel } from '../../models/ubicacion.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  years: string[];
  locations: UbicacionModel[];
  selectedYear: string;
  selectedLocation: number;
  statusPantalla: number;
  loading: boolean = true;
  dashboard: DashboardModel;
  constructor(
    private toastr: ToastrService,
    private dashboardService: DashboardService,
    private variablesService: VariablesService,
    private ubicacionesService: UbicacionesService,
  ){
    this.statusPantalla = this.variablesService.getStatusPantalla();
    this.years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030',
                  '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040', '2041', '2042',
                  '2043', '2044', '2045', '2046', '2047', '2048', '2049', '2050', '2051', '2052', '2053', '2054'];
    this.selectedYear = new Date().getFullYear().toString();
  }

  ngOnInit(): void {
    this.getLocations()
    this.getDashboard(this.selectedYear, 0);
  }

  getDashboard(year: string, idSucursal: number){
    this.dashboard = new DashboardModel();
    this.dashboardService.getDashboard(year, idSucursal).subscribe({
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
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
    });
  }

  getLocations(){
    this.ubicacionesService.getUbicaciones().subscribe(response => {
      if(response.exito){
        this.locations = response.respuesta;
        this.loading = false;
      }
    }, err => {
      this.locations = [];
      this.loading = false;
    });
  }

  sendFilters(){
    if(this.selectedYear != undefined){
      this.getDashboard(this.selectedYear, this.selectedLocation == undefined ? 0 : this.selectedLocation);
    }else{
      this.toastr.warning('Debes seleccionar el año a mostrar...', 'Atención!');
    }
  }
}
