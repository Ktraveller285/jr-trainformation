import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfServiceDialogComponent } from './terms-of-service-dialog.component';

describe('TermsOfServiceDialogComponent', () => {
  let component: TermsOfServiceDialogComponent;
  let fixture: ComponentFixture<TermsOfServiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsOfServiceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
