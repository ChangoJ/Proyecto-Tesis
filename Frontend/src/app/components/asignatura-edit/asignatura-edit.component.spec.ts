import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaturaEditComponent } from './asignatura-edit.component';

describe('AsiganturaEditComponent', () => {
  let component: AsignaturaEditComponent;
  let fixture: ComponentFixture<AsignaturaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignaturaEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignaturaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
