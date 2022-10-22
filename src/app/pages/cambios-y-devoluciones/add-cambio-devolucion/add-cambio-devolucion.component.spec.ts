import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCambioDevolucionComponent } from './add-cambio-devolucion.component';

describe('AddCambioDevolucionComponent', () => {
  let component: AddCambioDevolucionComponent;
  let fixture: ComponentFixture<AddCambioDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCambioDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCambioDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
