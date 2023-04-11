import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPagoPedidoComponent } from './add-pago-pedido.component';

describe('AddPagoPedidoComponent', () => {
  let component: AddPagoPedidoComponent;
  let fixture: ComponentFixture<AddPagoPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPagoPedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPagoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
