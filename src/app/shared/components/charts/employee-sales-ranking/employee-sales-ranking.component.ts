import { Component, OnInit, Input } from '@angular/core';
import { RankingModel } from 'src/app/shared/models/ranking.model';

@Component({
  selector: 'app-employee-sales-ranking',
  templateUrl: './employee-sales-ranking.component.html',
  styleUrls: ['./employee-sales-ranking.component.css']
})
export class EmployeeSalesRankingComponent implements OnInit {
  @Input() _data: RankingModel;
  constructor() { }

  ngOnInit(): void {
  }

}
