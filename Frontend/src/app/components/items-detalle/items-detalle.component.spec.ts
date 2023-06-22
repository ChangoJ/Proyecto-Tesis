import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsDetalleComponent } from './items-detalle.component';

describe('ItemsDetalleComponent', () => {
  let component: ItemsDetalleComponent;
  let fixture: ComponentFixture<ItemsDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
