import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsUsuarioComponent } from './items-usuario.component';

describe('ItemsUsuarioComponent', () => {
  let component: ItemsUsuarioComponent;
  let fixture: ComponentFixture<ItemsUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
