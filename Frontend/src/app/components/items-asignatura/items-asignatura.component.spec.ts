import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsAsignaturaComponent } from './items-asignatura.component';

describe('ItemsAsignaturaComponent', () => {
  let component: ItemsAsignaturaComponent;
  let fixture: ComponentFixture<ItemsAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsAsignaturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
