import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiosYDevolucionesComponent } from './cambios-y-devoluciones.component';

describe('CambiosYDevolucionesComponent', () => {
  let component: CambiosYDevolucionesComponent;
  let fixture: ComponentFixture<CambiosYDevolucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiosYDevolucionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiosYDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
