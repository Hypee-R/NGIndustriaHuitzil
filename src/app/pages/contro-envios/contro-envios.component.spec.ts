import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControEnviosComponent } from './contro-envios.component';

describe('ControEnviosComponent', () => {
  let component: ControEnviosComponent;
  let fixture: ComponentFixture<ControEnviosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControEnviosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControEnviosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
