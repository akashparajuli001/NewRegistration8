import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { RoutingModule } from './app.routing.module';
import { MobileLayoutComponent } from './layout/mobile-layout/mobile-layout.component';
import { WebLayoutComponent } from './layout/web-layout/web-layout.component';
import { ApiService } from './services/api.service';
import { RegisterService } from './services/register.service';
import { ToasterService, ToasterModule } from 'angular2-toaster';
import { SerialTableService } from './services/serialtable.service';
import { PdfService } from './services/pdf.service';
import { IpAddressService } from './services/ipAddress.service';
import { DynamicScriptLoaderService } from './services/dynamicscriptloader.service';
import { DomService } from './services/dom.service';
import { DailogContentProductComponent } from './layout/dailog-content-product/dailog-content-product.component';
import { DailogContentConfirmationComponent } from './layout/dailog-content-confirmation/dailog-content-confirmation.component';
import { DailogContentUnitcoverageComponent } from './layout/dailog-content-unitcoverage/dailog-content-unitcoverage.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpTokenInterceptor } from './services/http.token.interceptor';
import { HttpModule } from '@angular/http';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FocusDirective } from './directive/focus.directive';
import { ProductInfoComponent } from './shared/product-info/product-info.component';
import { ProductInfoMobileComponent } from './shared/product-info-mobile/product-info-mobile.component';
import { SerialTableComponent } from './layout/mobile-layout/serial-table/serial-table.component';

@NgModule({
  declarations: [
    AppComponent,
    FocusDirective,
    LayoutComponent,
    MobileLayoutComponent,
    WebLayoutComponent,
    ProductInfoComponent,
    ProductInfoMobileComponent,
    SerialTableComponent,
    DailogContentProductComponent,
    DailogContentConfirmationComponent,
    DailogContentUnitcoverageComponent
  ],
  imports: [
    HttpClientModule,
    // tslint:disable-next-line: deprecation
    HttpModule,
    BrowserModule,
    //FocusDirective,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RoutingModule,
    MaterialModule,
    NgxUiLoaderModule,
    ToasterModule.forRoot(),
    // Ng4LoadingSpinnerModule.forRoot(),
    DeviceDetectorModule.forRoot()
  ],
  entryComponents: [
    //SerialTableComponent,
    DailogContentProductComponent,
    DailogContentConfirmationComponent,
    DailogContentUnitcoverageComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    RegisterService,
    ToasterService,
    SerialTableService,
    DomService,
    PdfService,
    IpAddressService,
    DynamicScriptLoaderService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
