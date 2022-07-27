import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddubicacionComponent } from './add-ubicacion.component';

describe('AddubicacionComponent', () => {
  let component: AddubicacionComponent;
  let fixture: ComponentFixture<AddubicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddubicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddubicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
