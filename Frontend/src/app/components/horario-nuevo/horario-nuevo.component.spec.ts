import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioNuevoComponent } from './horario-nuevo.component';

describe('HorarioNuevoComponent', () => {
  let component: HorarioNuevoComponent;
  let fixture: ComponentFixture<HorarioNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
