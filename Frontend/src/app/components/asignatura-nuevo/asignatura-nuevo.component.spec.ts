import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaturaNuevoComponent } from './asignatura-nuevo.component';

describe('AsignaturaNuevoComponent', () => {
  let component: AsignaturaNuevoComponent;
  let fixture: ComponentFixture<AsignaturaNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignaturaNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignaturaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
