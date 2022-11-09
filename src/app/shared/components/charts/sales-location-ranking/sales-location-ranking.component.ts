import { Component, OnInit, Input } from '@angular/core';
import { RankingModel } from 'src/app/shared/models/ranking.model';

@Component({
  selector: 'app-sales-location-ranking',
  templateUrl: './sales-location-ranking.component.html',
  styleUrls: ['./sales-location-ranking.component.css']
})
export class SalesLocationRankingComponent implements OnInit {
  @Input() _data: RankingModel;
  constructor() { }

  ngOnInit(): void {
  }

}
