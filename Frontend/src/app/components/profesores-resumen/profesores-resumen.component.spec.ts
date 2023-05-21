import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesoresResumenComponent } from './profesores-resumen.component';

describe('ProfesoresResumenComponent', () => {
  let component: ProfesoresResumenComponent;
  let fixture: ComponentFixture<ProfesoresResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfesoresResumenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesoresResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
