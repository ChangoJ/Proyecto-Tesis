import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsProfesorComponent } from './items-profesor.component';

describe('ItemsProfesorComponent', () => {
  let component: ItemsProfesorComponent;
  let fixture: ComponentFixture<ItemsProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsProfesorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
