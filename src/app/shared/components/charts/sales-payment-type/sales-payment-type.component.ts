import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { BarChartModel } from 'src/app/shared/models/bar-chart.model';

export type ChartOptions = {
  title: ApexTitleSubtitle;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-sales-payment-type',
  templateUrl: './sales-payment-type.component.html',
  styleUrls: ['./sales-payment-type.component.css']
})
export class SalesPaymentTypeComponent implements OnInit {
  @Input() _data: BarChartModel;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() { }

  ngOnInit(): void {
    this.initChart(this._data);
  }

  initChart(data: BarChartModel){
    this.chartOptions = {
      title: {
        text: data.title,
        align: "left",
        // margin: 30,
        // style: {
        //     fontSize: '1.4rem',
        //     fontWeight: 'bold',
        // }
      },
      series: data.series,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ]
      },
      yaxis: {
        title: {
          text: "No de Ventas"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "# " + val + " ventas";
          }
        }
      }
    };

  }

}
