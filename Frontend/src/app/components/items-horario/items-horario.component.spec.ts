import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsHorarioComponent } from './items-horario.component';

describe('ItemsHorarioComponent', () => {
  let component: ItemsHorarioComponent;
  let fixture: ComponentFixture<ItemsHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsHorarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
