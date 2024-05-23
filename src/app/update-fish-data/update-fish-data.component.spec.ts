import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFishDataComponent } from './update-fish-data.component';

describe('UpdateFishDataComponent', () => {
  let component: UpdateFishDataComponent;
  let fixture: ComponentFixture<UpdateFishDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFishDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFishDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
