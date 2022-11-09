import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLocationRankingComponent } from './sales-location-ranking.component';

describe('SalesLocationRankingComponent', () => {
  let component: SalesLocationRankingComponent;
  let fixture: ComponentFixture<SalesLocationRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesLocationRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesLocationRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
