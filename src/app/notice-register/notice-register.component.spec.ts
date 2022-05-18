import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeRegisterComponent } from './notice-register.component';

describe('NoticeRegisterComponent', () => {
  let component: NoticeRegisterComponent;
  let fixture: ComponentFixture<NoticeRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
