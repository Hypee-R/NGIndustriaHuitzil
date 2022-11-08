export class BarChartModel{
  public title: string;
  public series: Series[];
}

class Series{
  name: string;
  data: number[];
}
