import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNuevoComponent } from './detalle-nuevo.component';

describe('DetalleNuevoComponent', () => {
  let component: DetalleNuevoComponent;
  let fixture: ComponentFixture<DetalleNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
