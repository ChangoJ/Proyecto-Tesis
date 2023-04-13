import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsAulaComponent } from './items-aula.component';

describe('ItemsAulaComponent', () => {
  let component: ItemsAulaComponent;
  let fixture: ComponentFixture<ItemsAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsAulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
