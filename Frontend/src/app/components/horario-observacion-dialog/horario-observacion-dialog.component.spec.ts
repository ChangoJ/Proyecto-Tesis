import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioObservacionDialogComponent } from './horario-observacion-dialog.component';

describe('HorarioObservacionDialogComponent', () => {
  let component: HorarioObservacionDialogComponent;
  let fixture: ComponentFixture<HorarioObservacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioObservacionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioObservacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
