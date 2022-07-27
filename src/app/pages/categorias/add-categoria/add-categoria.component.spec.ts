import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcategoriaComponent } from './add-categoria.component';

describe('AddcategoriaComponent', () => {
  let component: AddcategoriaComponent;
  let fixture: ComponentFixture<AddcategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcategoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
