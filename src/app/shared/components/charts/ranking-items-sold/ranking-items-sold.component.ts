import { Component, OnInit, Input } from '@angular/core';
import { RankingModel } from 'src/app/shared/models/ranking.model';

@Component({
  selector: 'app-ranking-items-sold',
  templateUrl: './ranking-items-sold.component.html',
  styleUrls: ['./ranking-items-sold.component.css']
})
export class RankingItemsSoldComponent implements OnInit {
  @Input() _data: RankingModel;

  constructor() { }

  ngOnInit(): void {
  }

}
