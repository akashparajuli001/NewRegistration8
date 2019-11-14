import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogContentProductComponent } from './dailog-content-product.component';

describe('DailogContentProductComponent', () => {
  let component: DailogContentProductComponent;
  let fixture: ComponentFixture<DailogContentProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogContentProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogContentProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
