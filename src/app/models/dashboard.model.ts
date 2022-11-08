import { BarChartModel } from "../shared/models/bar-chart.model";
import { CardModel } from "../shared/models/card.model";
import { RankingModel } from '../shared/models/ranking.model';

export class DashboardModel{
  public cards: CardModel[];
  public barchart: BarChartModel;
  public rankingA: RankingModel;
  public rankingE: RankingModel;
  public rankingS: RankingModel;
}
