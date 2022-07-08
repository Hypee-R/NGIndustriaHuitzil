import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTallaComponent } from './add-talla.component';

describe('AddTallaComponent', () => {
  let component: AddTallaComponent;
  let fixture: ComponentFixture<AddTallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTallaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
