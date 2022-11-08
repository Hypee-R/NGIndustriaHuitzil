import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalesRankingComponent } from './employee-sales-ranking.component';

describe('EmployeeSalesRankingComponent', () => {
  let component: EmployeeSalesRankingComponent;
  let fixture: ComponentFixture<EmployeeSalesRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSalesRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSalesRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
