import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfoMobileComponent } from './product-info-mobile.component';

describe('ProductInfoMobileComponent', () => {
  let component: ProductInfoMobileComponent;
  let fixture: ComponentFixture<ProductInfoMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInfoMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInfoMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
