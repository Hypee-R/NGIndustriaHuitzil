import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingItemsSoldComponent } from './ranking-items-sold.component';

describe('RankingItemsSoldComponent', () => {
  let component: RankingItemsSoldComponent;
  let fixture: ComponentFixture<RankingItemsSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingItemsSoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingItemsSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
