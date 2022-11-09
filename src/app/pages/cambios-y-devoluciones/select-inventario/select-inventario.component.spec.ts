import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInventarioComponent } from './select-inventario.component';

describe('SelectInventarioComponent', () => {
  let component: SelectInventarioComponent;
  let fixture: ComponentFixture<SelectInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
