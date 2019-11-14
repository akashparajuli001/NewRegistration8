import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogContentConfirmationComponent } from './dailog-content-confirmation.component';

describe('DailogContentConfirmationComponent', () => {
  let component: DailogContentConfirmationComponent;
  let fixture: ComponentFixture<DailogContentConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogContentConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogContentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
