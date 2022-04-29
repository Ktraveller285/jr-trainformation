import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSelectComponent } from './line-select.component';

describe('LineSelectComponent', () => {
  let component: LineSelectComponent;
  let fixture: ComponentFixture<LineSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
