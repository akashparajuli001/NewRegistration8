import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogContentUnitcoverageComponent } from './dailog-content-unitcoverage.component';

describe('DailogContentUnitcoverageComponent', () => {
  let component: DailogContentUnitcoverageComponent;
  let fixture: ComponentFixture<DailogContentUnitcoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogContentUnitcoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogContentUnitcoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
