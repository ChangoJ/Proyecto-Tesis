import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasDialogComponent } from './carreras-dialog.component';

describe('CarrerasDialogComponent', () => {
  let component: CarrerasDialogComponent;
  let fixture: ComponentFixture<CarrerasDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrerasDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrerasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
