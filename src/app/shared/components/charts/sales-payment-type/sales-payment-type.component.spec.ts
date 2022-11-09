import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPaymentTypeComponent } from './sales-payment-type.component';

describe('SalesPaymentTypeComponent', () => {
  let component: SalesPaymentTypeComponent;
  let fixture: ComponentFixture<SalesPaymentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPaymentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
