import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEmptyComponent } from './item-empty.component';

describe('ItemEmptyComponent', () => {
  let component: ItemEmptyComponent;
  let fixture: ComponentFixture<ItemEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemEmptyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
