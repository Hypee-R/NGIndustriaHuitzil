import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountSelectorComponent } from './discount-selector.component';

describe('DiscountSelectorComponent', () => {
  let component: DiscountSelectorComponent;
  let fixture: ComponentFixture<DiscountSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
