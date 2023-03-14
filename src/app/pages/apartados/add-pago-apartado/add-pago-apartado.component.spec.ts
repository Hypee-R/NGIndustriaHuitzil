import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPagoApartadoComponent } from './add-pago-apartado.component';

describe('AddPagoApartadoComponent', () => {
  let component: AddPagoApartadoComponent;
  let fixture: ComponentFixture<AddPagoApartadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPagoApartadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPagoApartadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
