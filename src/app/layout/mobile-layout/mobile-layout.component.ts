// tslint:disable-next-line:max-line-length
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ChangeDetectorRef, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
//import { NgxCarousel } from 'ngx-carousel';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatDialog } from '@angular/material';
import { RegisterService } from '../../services/register.service';

import { SerialTableComponent } from './serial-table/serial-table.component';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Unit, RegistrationUnit, ConsumerEntity, Dealer, Entitlement } from '../../interface/serialdetail.interface';
import { DailogContentUnitcoverageComponent } from '../dailog-content-unitcoverage/dailog-content-unitcoverage.component';
import { DailogContentProductComponent } from '../dailog-content-product/dailog-content-product.component';
import { ActivatedRoute } from '@angular/router';
import { SerialTableService } from '../../services/serialtable.service';
import { DailogContentConfirmationComponent } from '../dailog-content-confirmation/dailog-content-confirmation.component';
import * as moment from 'moment'; //
import * as timezone from 'moment-timezone'; //
import { environment } from '../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomValidators } from 'ng2-validation';
// import * as jsPDF from 'jspdf';
declare let jsPDF;

@Component({
  selector: 'reg-mobile-layout',
  templateUrl: './mobile-layout.component.html',
  styleUrls: ['./mobile-layout.component.scss']
})


export class MobileLayoutComponent implements OnInit, OnDestroy {


  isLinear = true;
  productInfoFromGroup: FormGroup;
  dealerInfoFormGroup: FormGroup;
  customerInfoFormGroup: FormGroup;
  itemControl: FormControl = new FormControl();
  options = [];
  unit: Unit;
  IsDaikinUnit = false;
  unitsToRegister = new Array<Unit>();
  isCommericalType: boolean;
  disableAddSerial = true;
  filteredOptions: Observable<string[]>;
  WarningColor = '#ff0000';
  hasMailingAddress = false;
  responseUnitArray = new Array<RegistrationUnit>();
  consumer: ConsumerEntity;
  installer: Dealer;
  entitlementArray = new Array<Entitlement>();
  entitlement: Entitlement;
  entitlements: Observable<Entitlement[]>;
  isDirectComfortSerial = false;
  daikinSerialWithUnitCoverage = false;
  doesUnithasUnitExchangeCoverage = false;
  private agreeToAnnualMaintence = 0;
  invalidPhone= false;
  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeout: 9000
    });
  private systemErrorMessage = 'The system has encountered an error. IT has been notified. Please retry later';
  focusTriggerEmitter = new EventEmitter<boolean>();
  @ViewChild('dynamiccontent', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('firstname') firstNameElement: ElementRef;
  @ViewChild('pdfContent') pdfContent: ElementRef;

  componentData = null;
  maxDate = new Date();
  baazarVoiceUrl: string;
  constructor(
    private _formBuilder: FormBuilder,
    private registerService: RegisterService,
    private compiler: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private toasterService: ToasterService,
    private serialTableService: SerialTableService
  ) {

    //  // For test only
    //   this.entitlementArray = [
    //     {
    //       SerNum: '23243234',
    //       Model: 'asdfasdfas',
    //       Modeldesc: 'asdfasdfasdfasd',
    //       RegistrationDate: '05/06/12',
    //       InstallDate: new Date('01/12/2018'),
    //       ManufactureDate: '03/12/23',
    //       // tslint:disable-next-line:max-line-length

    //       StandardCoverage: '<table border="1"><thead><tr><th colspan="4">Standard Coverage</th></tr><tr><th>Coverage Type</th><th>Description</th><th>Effective Start</th><th>End Date</th></tr></thead><tbody><tr><td>All Parts</td><td>5 YEARS PARTS</td><td>04/04/2018</td><td>04/04/2023</td></tr></tbody></table>',
    //       // tslint:disable-next-line:max-line-length

    //       RegisteredCoverage: '<table border="1"><thead><tr><th colspan="4">Standard Coverage</th></tr><tr><th>Coverage Type</th><th>Description</th><th>Effective Start</th><th>End Date</th></tr></thead><tbody><tr><td>All Parts</td><td>5 YEARS PARTS</td><td>04/04/2018</td><td>04/04/2023</td></tr></tbody></table>'
    //     }
    //     ,
    //     {
    //       SerNum: '23243234',
    //       Model: 'asdfasdfas',
    //       Modeldesc: 'asdfasdfasdfasd',
    //       RegistrationDate: '05/06/12',
    //       InstallDate: new Date('01/12/2018'),
    //       ManufactureDate: '03/12/23',
    //       // tslint:disable-next-line:max-line-length
    //       StandardCoverage: '<table border="1"><thead><tr><th colspan="4">Standard Coverage</th></tr><tr><th>Coverage Type</th><th>Description</th><th>Effective Start</th><th>End Date</th></tr></thead><tbody><tr><td>All Parts</td><td>5 YEARS PARTS</td><td>04/04/2018</td><td>04/04/2023</td></tr></tbody></table>',
    //       // tslint:disable-next-line:max-line-length
    //       RegisteredCoverage: '<table border="1"><thead><tr><th colspan="4">Standard Coverage</th></tr><tr><th>Coverage Type</th><th>Description</th><th>Effective Start</th><th>End Date</th></tr></thead><tbody><tr><td>All Parts</td><td>5 YEARS PARTS</td><td>04/04/2018</td><td>04/04/2023</td></tr></tbody></table>'
    //     }
    //   ];

    //   this.entitlements = Observable.of(this.entitlementArray);
  }

  ngOnInit() {
    this.productInfoFromGroup = this._formBuilder.group({
      serialNumber: [''],
      installDate: [''],
      installType: ['', Validators.required]
    });
    this.dealerInfoFormGroup = this._formBuilder.group({
      dlrNameCtrl: ['', Validators.required],
      dlrPhoneCtrl: ['', Validators.required]
      // dlrAddr1Ctrl: [''],
      // dlrZipCodeCtrl: [''],
      // dlrCityCtrl: [''],
      // dlrStateCtrl: [''],
      // dlrCountryCtrl: [''],
    });
    this.customerInfoFormGroup = this._formBuilder.group({
      firstNameCtrl: [''],
      lstNameCtrl: [''],
      businesNameCtrl: [''],
      addr1Ctrl: ['', Validators.required],
      addr2Ctrl: [''],
      zipCtrl: ['', Validators.required],
      cityCtrl: ['', Validators.required],
      stateCtrl: ['', [Validators.required, Validators.maxLength(2)]],
      phoneCtrl: ['', Validators.required],
      emailCtrl: [''],
      countryCtrl: ['United States', Validators.required],
      mailingAddressChkBoxContrl: [''],
      mailingAddr1Ctrl: [''],
      mailingAddr2Ctrl: [''],
      mailingZipCtrl: [''],
      mailingCityCtrl: [''],
      mailingStateCtrl: [''],
      mailingCountryCtrl: ['United States']
    });
    this.customerInfoFormGroup.controls['mailingAddressChkBoxContrl'].valueChanges.subscribe(value => {

      if (value) {
        this.hasMailingAddress = true;
        this.customerInfoFormGroup.get('mailingAddr1Ctrl').setValidators([Validators.required]);
        this.customerInfoFormGroup.get('mailingZipCtrl').setValidators([Validators.required]);
        this.customerInfoFormGroup.get('mailingCityCtrl').setValidators([Validators.required]);
        this.customerInfoFormGroup.get('mailingStateCtrl').setValidators([Validators.required]);
        this.customerInfoFormGroup.get('mailingCountryCtrl').setValidators([Validators.required]);
      }
      // tslint:disable-next-line:one-line
      else {
        this.hasMailingAddress = false;
        this.customerInfoFormGroup.controls['mailingAddr1Ctrl'].clearValidators();
        this.customerInfoFormGroup.controls['mailingAddr1Ctrl'].updateValueAndValidity();
        this.customerInfoFormGroup.controls['mailingAddr2Ctrl'].clearValidators();
        this.customerInfoFormGroup.controls['mailingAddr2Ctrl'].updateValueAndValidity();
        this.customerInfoFormGroup.controls['mailingZipCtrl'].clearValidators();
        this.customerInfoFormGroup.controls['mailingZipCtrl'].updateValueAndValidity();
        this.customerInfoFormGroup.controls['mailingCityCtrl'].clearValidators();
        this.customerInfoFormGroup.controls['mailingCityCtrl'].updateValueAndValidity();
        this.customerInfoFormGroup.controls['mailingStateCtrl'].clearValidators();
        this.customerInfoFormGroup.controls['mailingStateCtrl'].updateValueAndValidity();
        this.customerInfoFormGroup.controls['mailingCountryCtrl'].clearValidators();
        this.customerInfoFormGroup.controls['mailingCountryCtrl'].updateValueAndValidity();
      }
      this.productInfoFromGroup.controls['installType'].valueChanges.subscribe(() => {
        this.productInfoFromGroup.get('installDate').setValidators([Validators.required]);
      });
      this.cdr.detectChanges();
    });
    this.productInfoFromGroup.controls['installType'].valueChanges.subscribe((installTypVal) => {
      if (installTypVal == 'COM') {

        this.isCommericalType = true;
        this.customerInfoFormGroup.controls['firstNameCtrl'].clearValidators();
        this.customerInfoFormGroup.controls['firstNameCtrl'].updateValueAndValidity();
        this.customerInfoFormGroup.controls['lstNameCtrl'].clearValidators();
        this.customerInfoFormGroup.controls['lstNameCtrl'].updateValueAndValidity();


        this.customerInfoFormGroup.get('businesNameCtrl').setValidators([Validators.required]);

      }
      // tslint:disable-next-line:one-line
      else {

        this.customerInfoFormGroup.get('firstNameCtrl').setValidators([Validators.required]);
        this.customerInfoFormGroup.get('lstNameCtrl').setValidators([Validators.required]);

        this.customerInfoFormGroup.controls['businesNameCtrl'].clearValidators();
        this.customerInfoFormGroup.controls['businesNameCtrl'].updateValueAndValidity();
        this.isCommericalType = false;
      }

    });
    this.productInfoFromGroup.controls['installDate'].valueChanges.subscribe(v => {

      if (v !== '') {
        this.validateSerialTable(v);
      }

    });

  }

  ngOnDestroy() {
    this.unitsToRegister.length = 0;
  }
  onItemChange(item: string) {
    console.log(item);
  }
  onEmailAddressChange(value) {
    if (value != '') {
      this.customerInfoFormGroup.get('emailCtrl').setValidators([CustomValidators.email]);
    } else {
      this.customerInfoFormGroup.controls['emailCtrl'].clearValidators();
      this.customerInfoFormGroup.controls['emailCtrl'].updateValueAndValidity();
      console.log('empty');
    }
  }
  onStateChange(state: string) {
    if (state.length > 2) {
      this.toasterService.pop('error', '', 'Please abbreviate the state with 2 letters.');
    }

  }
  /**** Click functions  */
  addSerial(): void {
    if (this.unitsToRegister.length > 9) {
      this.toasterService.pop('error', '', "You have reached the maxium number of serial number");
      return;
    }
    const serialnumber = this.productInfoFromGroup.value.serialNumber;
    const item = this.itemControl.value;

    const exists = this.unitsToRegister.filter(
      x => x.serialnumber === serialnumber && x.item === item
    );

    if (exists.length > 1) {
      this.toasterService.pop('error', '', 'Already exists. Please enter different serial number.');
      // const index = this.unitsToRegister.findIndex(opt => opt.serialnumber === unit.serialnumber && opt.item === unit.item);
      // this.unitsToRegister.splice(index, 1);
      return;
    }


    this.ngxService.start();
    console.log('add serial');
    this.registerService.validateItem(serialnumber, item)
      .subscribe(
        response => {
          this.ngxService.stop();
          console.log(response);
          const severity = response.d.Severity;
          if (severity > 0) {
            // tslint:disable-next-line:max-line-length
            const index = this.unitsToRegister.findIndex(opt => opt.serialnumber === response.d.SerialNumber && opt.item === response.d.ModelNumber);
            if (index > -1) {
              this.unitsToRegister.splice(index, 1);
              //  this.serialTableService.removeSerial
            }
            this.toasterService.pop('error', '', response.d.Error.Message);

          } else {
            this.disableAddSerial = true;
            this.createSerialTableComponent();

            this.productInfoFromGroup.setValue({
              'serialNumber': '',
              'installDate': this.productInfoFromGroup.value.installDate,
              'installType': this.productInfoFromGroup.value.installType
            });
            this.itemControl.reset();

          }

        });

  }
//TODO - validate phone number on change.
onPhoneNumberChange(phone:string){
  console.log('validate phone number');
  this.ngxService.start();
  this.registerService.validatePhoneNumber(phone).subscribe(
    response => {
      this.ngxService.stop();
      let isValid = response.d.isValid;
      if(!isValid){
        this.customerInfoFormGroup.controls['phoneCtrl'].setErrors({'incorrect': true});
        this.invalidPhone = true;
        this.customerInfoFormGroup.updateValueAndValidity();
       // swal('Error', "Invalid Phone number.", 'error');
      }else{
        this.invalidPhone = false;
      }
      
    },
    () => {
      this.ngxService.stop();
    }
  );
}
  createSerialTableComponent() {


    // create dynamic component
    const comp = this.compiler.resolveComponentFactory(SerialTableComponent);
    const expComponent = this.container.createComponent(comp, 0, null);
    //set values
    expComponent.instance._ref = expComponent;
    expComponent.instance.unit = this.unit;
    this.serialTableService.addSerialToRegister(this.unit);
  }
  isNextButtonValid(): Boolean {
    let isValid = false;
    if (this.unitsToRegister.length > 0 && this.productInfoFromGroup.valid) {
      isValid = true;
      for (const el of this.unitsToRegister) {
        if (el.warning !== '') {
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  }
  converToJsonDate(dt: string): Date {

    if (dt === null) {
      return null;
    }
    // tslint:disable-next-line:radix
    return new Date(parseInt(dt.replace('/Date(', '')));
  }
  onZipCodeChange(zipcode: string): void {

    this.ngxService.start();
    this.registerService.zipcodeLookup(zipcode).subscribe(
      response => {
        this.ngxService.stop();
        const result = response.d;
        this.customerInfoFormGroup.controls['cityCtrl'].setValue(result.City);
        this.customerInfoFormGroup.controls['stateCtrl'].setValue(result.State);
      }, () => {
        this.ngxService.stop();
        this.toasterService.pop('error', '', this.systemErrorMessage);
      }
    );

  }
  onMailingZipCodeChange(zipcode: string): void {

    this.ngxService.start();
    this.registerService.zipcodeLookup(zipcode).subscribe(
      response => {
        this.ngxService.stop();
        const result = response.d;
        this.customerInfoFormGroup.controls['mailingCityCtrl'].setValue(result.City);
        this.customerInfoFormGroup.controls['mailingStateCtrl'].setValue(result.State);
      }, () => {
        this.ngxService.stop();
        this.toasterService.pop('error', '', this.systemErrorMessage);
      }
    );

  }
  onSerialNumberChange(serialnumber: string): void {
    console.log('on serial change');
    this.validateUnitsToregister();

    this.ngxService.start();
    const queryString = window.location.href;
    this.registerService.getItemsFor(serialnumber).subscribe(
      response => {

        this.ngxService.stop();
        const result = response.d;
        if (result.Severity > 0) {
          this.errorOnValidatingSerial(response);
          this.disableAddSerial = true;
          return;
        }
        this.options = [];
        if (result.SerNumValid) {
          this.disableAddSerial = false;
          if (result.ItemList.length > 1) {
            // tslint:disable-next-line:forin
            this.itemControl.reset({ value: '', disabled: false });
            for (let _i = 0; _i < result.ItemList.length; _i++) {
              const model = result.ItemList[_i].ItemModel;
              this.options.push(model);
            }
            this.filteredOptions = this.itemControl.valueChanges.pipe(
              startWith(''),
              map(val =>
              // tslint:disable-next-line:one-line
              {
                const selectedVal = this.filter(val);
                if (selectedVal.length === 1) {
                  const itemResult = result.ItemList.filter(options => options.ItemModel === selectedVal[0]);
                  // tslint:disable-next-line:max-line-length
                  if (this.unitsToRegister.filter(o => o.item === itemResult[0].ItemModel && o.serialnumber === itemResult[0].SerNum).length === 0) {
                    console.log('itemResult' + itemResult[0]);
                    const mfgDate = new Date(this.converToJsonDate(itemResult[0].ManufactureDate));

                    if (mfgDate === null) {
                      this.toasterService.pop('error', '', 'Serial number is missing manufacture date');
                      this.disableAddSerial = true;
                      return;
                    }

                    this.unit = {
                      serialnumber: itemResult[0].SerNum,
                      item: itemResult[0].ItemModel,
                      modeldesc: itemResult[0].ProductCodeDescription,
                      Manufacturer: itemResult[0].ManufacturerNum,
                      ManufactureDate: mfgDate,
                      HasUnitExchangeCoverage: itemResult[0].HasUnitExchangeCoverage,
                      warning: ''
                    };
                  }
                }
                if ((this.unit.Manufacturer.toUpperCase() === 'GOODMAN' || this.unit.Manufacturer.toUpperCase() === 'AMANA')
                  && (this.isDirectComfortSerial = queryString.indexOf('directcomfort') !== -1)) {
                  this.isDirectComfortSerial = true;
                }

                if ((this.unit != null && this.daikinSerialWithUnitCoverage == false && this.productInfoFromGroup.controls['installType'].value == 'RES'  && (this.unit.Manufacturer.toUpperCase() === 'DAIKIN' && this.unit.HasUnitExchangeCoverage))) {
                  this.daikinSerialWithUnitCoverage = true;
                }
                return selectedVal;
              }

              )
            );
            // tslint:disable-next-line:one-line
          }
          // tslint:disable-next-line:one-line
          else

          // tslint:disable-next-line:one-line
          {
            // this.myControl = new FormControl({value:'Akash',disabled:true});

            if (this.unitsToRegister.filter(o => o.item === result.ItemList[0].ItemModel
              && o.serialnumber === result.ItemList[0].SerNum).length > 0) {
              this.toasterService.pop('error', '', 'Already exists. Please enter different serial number.');
              return;
            }
            this.itemControl.reset({ value: result.ItemList[0].ItemModel, disabled: true });
            if (this.unitsToRegister.filter(o => o.item === result.ItemList[0].ItemModel
              && o.serialnumber === result.ItemList[0].SerNum).length === 0) {

              const mfgDate = this.converToJsonDate(result.ItemList[0].ManufactureDate);

              if (mfgDate === null) {
                this.toasterService.pop('error', '', 'Serial number is missing manufacture date');
                this.disableAddSerial = true;
                return;
              }
              this.unit = {
                serialnumber: result.ItemList[0].SerNum,
                item: result.ItemList[0].ItemModel,
                modeldesc: result.ItemList[0].ProductCodeDescription,
                Manufacturer: result.ItemList[0].ManufacturerNum,
                ManufactureDate: result.ItemList[0].ManufactureDate,
                HasUnitExchangeCoverage: result.ItemList[0].HasUnitExchangeCoverage,
                warning: ''
              };
              this.saveSerialInfo(this.unit);
              this.addSerial();
              this.disableAddSerial = true;
              if ((this.unit.Manufacturer.toUpperCase() === 'GOODMAN' || this.unit.Manufacturer.toUpperCase() === 'AMANA')
                && (this.isDirectComfortSerial = queryString.indexOf('directcomfort') !== -1)) {
                this.isDirectComfortSerial = true;
              }

              if ((this.unit != null && this.daikinSerialWithUnitCoverage == false && this.productInfoFromGroup.controls['installType'].value == 'RES'  && (this.unit.Manufacturer.toUpperCase() === 'DAIKIN' && this.unit.HasUnitExchangeCoverage))) {
                this.daikinSerialWithUnitCoverage = true;
              }
            }
          }
        }


      }, () => {
        this.ngxService.stop();
        this.toasterService.pop('error', '', this.systemErrorMessage);
      }
    );
  }

  focusFirstName() {

    setTimeout(() => {
      this.focusTriggerEmitter.emit(true);
    }, 400);

  }
  validateUnitsToregister() {
    this.serialTableService.validateSerial().subscribe(x => this.unitsToRegister = x);
    //  this.serialTableService.unitsToRegisterValidate(this.unitsToRegister).subscribe(x => this.unitsToRegister = x);
  }
  openProductDialog(stepper) {
    const dialogRef = this.dialog.open(DailogContentProductComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result === 'NO') {
      }
      if (result === 'CONTINUE') {
        stepper.next();
        this.focusFirstName();
      }
    });
  }


  openUnitCoverageDialog(stepper) {


    if (this.daikinSerialWithUnitCoverage) {
      const dialogRef = this.dialog.open(DailogContentUnitcoverageComponent, {});

      dialogRef.afterClosed().subscribe(result => {

        if (result === 'decline') {
          this.doesUnithasUnitExchangeCoverage = false;
          this.agreeToAnnualMaintence = 0;
        }
        if (result === 'affirm') {
          this.doesUnithasUnitExchangeCoverage = true;
          this.agreeToAnnualMaintence = 1;
        }
        this.openConfirmationDialog(stepper);
      });

    } else {
      this.openConfirmationDialog(stepper);
    }



  }

  openConfirmationDialog(stepper) {
    this.validateUnitsToregister();
    const dialogRef = this.dialog.open(DailogContentConfirmationComponent, {
      data: {
        unitsToRegister: this.unitsToRegister,
        customerInfo: this.consumer = {
          Address1: this.customerInfoFormGroup.controls['addr1Ctrl'].value,
          Address2: this.customerInfoFormGroup.controls['addr2Ctrl'].value,
          FirstName: this.customerInfoFormGroup.controls['firstNameCtrl'].value,
          LastName: this.customerInfoFormGroup.controls['lstNameCtrl'].value,
          City: this.customerInfoFormGroup.controls['cityCtrl'].value,
          state: this.customerInfoFormGroup.controls['stateCtrl'].value,
          Zip: this.customerInfoFormGroup.controls['zipCtrl'].value,
          PhoneNumber: this.customerInfoFormGroup.controls['phoneCtrl'].value,
          CompanyName: this.customerInfoFormGroup.controls['businesNameCtrl'].value
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'decline') {
      }
      if (result === 'affirm') {
        this.registerUnit(stepper);
      }
    });
  }



  validateSerialTable(installedDate: Date): boolean {
    let isValid = true;
    if (installedDate instanceof Date) {

    } else {
      installedDate = new Date(installedDate);
    }
    this.unitsToRegister.map(x => {
      const differenceInDays = this.daysdifference(installedDate, x.ManufactureDate);
      x.warning = '';
      if (differenceInDays > 1440) {
        x.warning = this.WarningColor;
        // tslint:disable-next-line:max-line-length
        this.toasterService.pop('error', '', 'Unable to Process Warranty Registration at this time. Please contact Homeowner Support at 877-254-4729 or 877-688-9191.');
        isValid = false;
      }
      if (installedDate < x.ManufactureDate) {
        this.toasterService.pop('error', '', 'Install date entered cannot be less than the date unit ' + x.serialnumber + ' was manufactured.');
        x.warning = this.WarningColor;
        isValid = false;
      }
      return x;

    });

    return isValid;
  }
  daysdifference(date1, date2) {
    const ONEDAY = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds

    let dt = this.converToJsonDate(date2);
    const date1_ms = date1.getTime();
    const date2_ms = dt.getTime();
    // Calculate the difference in milliseconds
    const difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms / ONEDAY);
  }
  errorOnValidatingSerial(response) {
    this.itemControl.reset();
    this.disableAddSerial = true;
    this.toasterService.pop('error', '', response.d.Error.Message);
  }
  startNewRegistration(stepper) {
    this.unitsToRegister.forEach(() => {
      this.container.remove();
    });
    this.unitsToRegister.length = 0;
    this.serialTableService.reset();
    this.productInfoFromGroup.reset();
    this.itemControl.reset();
    this.entitlementArray.length = 0;
    this.daikinSerialWithUnitCoverage = false;
    stepper.reset();
  }

  addAnotherUnitClick(stepper) {
    this.unitsToRegister.length = 0;
    this.productInfoFromGroup.reset();
    this.itemControl.reset();
    this.entitlementArray.length = 0;
    this.container.remove();
    this.daikinSerialWithUnitCoverage = false;
    stepper.selectedIndex = 0;
  }


  filter(val: string): string[] {
    return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  saveSerialInfo(serialInfo: Unit) {

    // this.unitsToRegister.push(serialInfo);
    this.serialTableService.addSerial(serialInfo).subscribe(x => this.unitsToRegister = x);
    console.log(this.unitsToRegister);
  }
  onClickProductNextButton(stepper) {

    if (this.productInfoFromGroup.value.installDate === '') {
      this.toasterService.pop('error', '', 'Install Date is required');
      return false;
    }

    for (const el of this.unitsToRegister) {
      if (el.Manufacturer === 'Daikin') {
        this.IsDaikinUnit = true;
        break;
      }
    }
    this.openProductDialog(stepper);
    this.validateUnitsToregister();
  }

  registerUnit(stepper) {

    this.consumer = {
      Address1: this.customerInfoFormGroup.controls['addr1Ctrl'].value,
      Address2: this.customerInfoFormGroup.controls['addr2Ctrl'].value,
      FirstName: this.customerInfoFormGroup.controls['firstNameCtrl'].value,
      LastName: this.customerInfoFormGroup.controls['lstNameCtrl'].value,
      City: this.customerInfoFormGroup.controls['cityCtrl'].value,
      state: this.customerInfoFormGroup.controls['stateCtrl'].value,
      Zip: this.customerInfoFormGroup.controls['zipCtrl'].value,
      Email: this.customerInfoFormGroup.controls['emailCtrl'].value,
      PhoneNumber: this.customerInfoFormGroup.controls['phoneCtrl'].value,
      CompanyName: this.customerInfoFormGroup.controls['businesNameCtrl'].value,
      Country: this.customerInfoFormGroup.controls['countryCtrl'].value,
      Source: 'WRG',
      receive_emails: 1,
      AddrType: this.productInfoFromGroup.controls['installType'].value === 'COM' ? 'B' : 'R',
      UsrNum: null,
      UsrSeq: null,
      MailingAddress: this.hasMailingAddress === true ? {
        FirstName: this.customerInfoFormGroup.controls['firstNameCtrl'].value,
        LastName: this.customerInfoFormGroup.controls['lstNameCtrl'].value,
        StreetAddress1: this.customerInfoFormGroup.controls['mailingAddr1Ctrl'].value,
        StreetAddress2: this.customerInfoFormGroup.controls['mailingAddr2Ctrl'].value,
        City: this.customerInfoFormGroup.controls['mailingCityCtrl'].value,
        State: this.customerInfoFormGroup.controls['mailingStateCtrl'].value,
        ZipCode: this.customerInfoFormGroup.controls['mailingZipCtrl'].value,
        Country: this.customerInfoFormGroup.controls['mailingCountryCtrl'].value,
      } : {}
    };

    this.installer = {
      Name: this.dealerInfoFormGroup.controls['dlrNameCtrl'].value,
      Phone: this.dealerInfoFormGroup.controls['dlrPhoneCtrl'].value
    };
    let registrationUnit: RegistrationUnit;
    const registrationUnits = new Array<RegistrationUnit>();
    this.unitsToRegister.forEach(element => {
      const installDate = new Date(this.productInfoFromGroup.controls['installDate'].value);
      let installedByDealer = null;
      let terminationdate = null;
      if (this.isDirectComfortSerial === true) {
        if (this.doesUnithasUnitExchangeCoverage) {
          installedByDealer = 1;
          terminationdate = '\/Date(' + installDate.valueOf() + ')\/';
        } else {
          installedByDealer = 0;
        }
      }
      registrationUnit = {
        Item: element.item,
        SerNum: element.serialnumber,
        Modeldesc: element.modeldesc,
        InstallType: this.productInfoFromGroup.controls['installType'].value,
        InstallDate: '\/Date(' + installDate.valueOf() + ')\/',// -- commented out may need change
        Installer: this.installer.Name,
        ComponentType: 0,
        Type: 'Condensers',
        InstallerPhone: this.installer.Phone,
        ManufactureNum: this.isDirectComfortSerial === true ? 'DIRECT COMFORT' : element.Manufacturer,
        ManufactureName: element.Manufacturer,
        agree_to_maintenance: this.agreeToAnnualMaintence,
        InstalledByDealer: installedByDealer,
        TerminationDate: terminationdate
      };
      registrationUnits.push(registrationUnit);
      this.setBaazarVoiceLink(element.item, element.Manufacturer);

    });
    this.ngxService.start();
    this.registerService.registerUnitsFor(this.consumer, this.installer, registrationUnits, this.isDirectComfortSerial).subscribe(
      response => {
        if (response.d.Severity > 0) {
          this.toasterService.pop('error', '', response.d.Error.Message);
          this.ngxService.stop();
        } else {

          this.responseUnitArray = response.d.Units;
          this.callEntitlement(stepper);
        }
      }, () => {
        this.ngxService.stop();
        this.toasterService.pop('error', '', this.systemErrorMessage);
      });
  }


  callEntitlement(stepper) {
    // tslint:disable-next-line:max-line-length
    // this.htmlStr = ` <table class="tblCoverage" border="1" cellpadding="1" cellspacing="1"><thead><tr><th class="theader" colspan="4">* Registered Standard Coverage</th></tr><tr ><th>Coverage Type</th><th>Description</th><th>Effective Start</th><th>End Date</th></tr></thead><tbody><tr><td>All Parts</td><td>10 YEARS PARTS</td><td>05/01/2018</td><td>05/01/2028</td></tr></tbody></table>`;
    for (const unit of this.responseUnitArray) {
      this.registerService.getEntitlement(unit.SerNum, unit.Item, this.customerInfoFormGroup.controls['lstNameCtrl'].value).subscribe(
        response => {
          this.ngxService.stop();
          if (response.d.Severity > 0) {
            this.toasterService.pop('error', '', 'There was a an error. Call customer service.');

          } else {
            stepper.next();
            this.entitlement = {
              SerNum: response.d.SerNum,
              Model: response.d.Model,
              Modeldesc: response.d.ModelDescription,
              RegistrationDate: response.d.RegisterDate == null ? new Date().toDateString() : this.converToJsonDate(response.d.RegisterDate).toDateString(),
              InstallDate: this.converToJsonDate(response.d.InstallDate),
              ManufactureDate: this.converToJsonDate(response.d.MfgDate).toDateString(),
              StandardCoverage: response.d.StandardDesktop,
              RegisteredCoverage: response.d.RegisteredDesktop,
              lines: response.d.entitlementlines
            };
            this.entitlementArray.push(this.entitlement);
          }

        }, () => {
          this.ngxService.stop();
          this.toasterService.pop('error', '', this.systemErrorMessage);
        });
    }
    this.entitlements = Observable.of(this.entitlementArray);
  }

  download() {
    this.generateTable('pdf');

  }
  email() {
    this.generateTable('email');
  }
  setBaazarVoiceLink(item, company) {
    let url = environment.BazzarVoiceUrl;
    url = url.replace('company', company.toLowerCase());
    url = url.replace('item', item);
    this.baazarVoiceUrl = url;
  }

  generateTable(param) {
    const pdf = new jsPDF('p', 'pt');
    const secondColumn = 170;
    const thirdColumn = 330;
    let rowheight = 50;
    const lineheight = 15;
    const leftPageMargin = 40;
    let currentPage = 0;
    let seconPageRowheight = 50;

    const entitlementColumns = [
      { title: 'Coverage Type', dataKey: 'Coverage_Type' },
      { title: 'Description', dataKey: 'Description' },
      { title: 'Effective Start Date', dataKey: 'StartDate' },
      { title: 'End Date', dataKey: 'EndDate' }
    ];
    pdf.setFontSize(18);
    pdf.setTextColor(40);
    pdf.setFontStyle('normal');

    pdf.text('Registration Certificate', leftPageMargin, rowheight);
    pdf.setFontSize(12);
    // tslint:disable-next-line:max-line-length
    rowheight = rowheight + lineheight;

    // tslint:disable-next-line:max-line-length
    pdf.text('Thank you for registering your product with us. We appreciate your business and will work hard ', leftPageMargin, rowheight);
    rowheight = rowheight + lineheight;
    pdf.text('to ensure that all our products will provide you with years of reliable service.', leftPageMargin, rowheight);

    pdf.setFontSize(14);
    pdf.setTextColor(40);
    rowheight = rowheight + lineheight + 10;
    pdf.text('Customer Information', leftPageMargin, rowheight);

    pdf.setFontSize(10);
    rowheight = rowheight + lineheight;
    if (this.consumer.AddrType === 'B') {
      pdf.text('', leftPageMargin, rowheight);
    } else {
      pdf.text('First Name: ' + this.consumer.FirstName, leftPageMargin, rowheight);
    }
    pdf.text('Zip Code: ' + this.consumer.Zip, leftPageMargin + secondColumn + 50, rowheight);

    rowheight = rowheight + lineheight;
    if (this.consumer.AddrType === 'B') {

      pdf.text('Business Name: ' + this.consumer.CompanyName, leftPageMargin, rowheight);
    } else {
      pdf.text('Last Name: ' + this.consumer.LastName, leftPageMargin, rowheight);
    }
    pdf.text('Country: ' + this.consumer.Country, leftPageMargin + secondColumn + 50, rowheight);

    rowheight = rowheight + lineheight;
    pdf.text('Address1: ' + this.consumer.Address1, leftPageMargin, rowheight);
    pdf.text('Phone: ' + this.consumer.PhoneNumber, leftPageMargin + secondColumn + 50, rowheight);

    rowheight = rowheight + lineheight;
    pdf.text('Address2: ' + this.consumer.Address2, leftPageMargin, rowheight);
    pdf.text('Email: ' + this.consumer.Email, leftPageMargin + secondColumn + 50, rowheight);

    rowheight = rowheight + lineheight;
    pdf.text('City: ' + this.consumer.City, leftPageMargin, rowheight);
    pdf.text('Dealer Name: ' + this.installer.Name, leftPageMargin + secondColumn + 50, rowheight);

    rowheight = rowheight + lineheight;
    pdf.text('State: ' + this.consumer.state, leftPageMargin, rowheight);
    pdf.text('Dealer Phone: ' + this.installer.Phone, leftPageMargin + secondColumn + 50, rowheight);

    rowheight = rowheight + lineheight + 10;
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Product Information', leftPageMargin, rowheight);

    for (let index = 0; index < this.entitlementArray.length; index++) {

      if (index === 0) {
        // pdf.autoTable(entitlementColumns, rows1, { margin: { top: 260 } });
        rowheight = rowheight + lineheight + 10;
        pdf.setFontSize(12);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text('Serial Number: ' + this.entitlementArray[index].SerNum, leftPageMargin, rowheight);
        pdf.text('Model: ' + this.entitlementArray[index].Model, leftPageMargin + secondColumn, rowheight);
        pdf.text('Model Desc: ' + this.entitlementArray[index].Modeldesc, leftPageMargin + thirdColumn, rowheight);
        // tslint:disable-next-line:max-line-length

        rowheight = rowheight + lineheight;
        pdf.text('Install Date: ' + this.getInstallDate(this.entitlementArray[index].InstallDate), leftPageMargin, rowheight);
        // tslint:disable-next-line:max-line-length
        var regDate = this.entitlementArray[index].RegistrationDate == null ? moment(new Date()).format('MM/DD/YYYY') : moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY');
        pdf.text('Registration Date: ' + regDate, leftPageMargin + secondColumn, rowheight);
        pdf.text('Manufacture Date: ' + moment(new Date(this.entitlementArray[index].ManufactureDate)).format('MM/DD/YYYY'), leftPageMargin + thirdColumn, rowheight);

        rowheight = rowheight + lineheight + 5;
        // standard Coverage
        if (this.entitlementArray[index].StandardCoverage !== '&nbsp;') {
          pdf.text('Standard Coverage', 250, rowheight);
          let standardCoverageRows = this.entitlementArray[index].lines.filter(x => x.Entitlement_Code === 'S');
          standardCoverageRows = standardCoverageRows.map(this.pdfEntitlementMap);
          pdf.autoTable(entitlementColumns, standardCoverageRows, { margin: { top: rowheight + 5 } });
        }
        // Registered Coverage

        if (this.entitlementArray[index].StandardCoverage === '&nbsp;') {
          pdf.text('Registered Coverage', 250, rowheight);
        } else {
          pdf.text('Registered Coverage', 250, pdf.autoTableEndPosY() + 15);
        }
        let registeredCoverageRows = this.entitlementArray[index].lines.filter(x => x.Entitlement_Code === 'R');
        registeredCoverageRows = registeredCoverageRows.map(this.pdfEntitlementMap);

        if (this.entitlementArray[index].StandardCoverage === '&nbsp;') {
          pdf.autoTable(entitlementColumns, registeredCoverageRows, { margin: { top: rowheight + 5 } });
        } else {
          //pdf.autoTable(entitlementColumns, registeredCoverageRows, { margin: { top: pdf.autoTableEndPosY() + 20 } });
          pdf.autoTable(entitlementColumns, registeredCoverageRows, { startY: pdf.autoTableEndPosY() + 20 });
          // pdf.autoTable(entitlementColumns, registeredCoverageRows, { margin: { top:20 } });
        }

      } else {
        if (currentPage === 0) {
          rowheight = pdf.autoTableEndPosY() + lineheight + 20;
          pdf.setFontSize(12);
          pdf.setFontSize(10);
          pdf.setTextColor(100);

          pdf.text('Serial Number: ' + this.entitlementArray[index].SerNum, leftPageMargin, rowheight);
          pdf.text('Model: ' + this.entitlementArray[index].Model, leftPageMargin + secondColumn, rowheight);
          pdf.text('Model Description: ' + this.entitlementArray[index].Modeldesc, leftPageMargin + thirdColumn, rowheight);
          // tslint:disable-next-line:max-line-length
          // pdf.text('Install Date: ' + moment(this.entitlementArray[index].InstallDate).format('MM/DD/YYYY'), leftPageMargin + thirdColumn, rowheight);

          rowheight = rowheight + lineheight;
          pdf.text('Install Date: ' + this.getInstallDate(this.entitlementArray[index].InstallDate), leftPageMargin, rowheight);
          // tslint:disable-next-line:max-line-length
          var regDate = this.entitlementArray[index].RegistrationDate == null ? moment(new Date()).format('MM/DD/YYYY') : moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY');
          pdf.text('Registration Date: ' + regDate, leftPageMargin + secondColumn, rowheight);
          //    pdf.text('Registration Date: ' + moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY'), leftPageMargin + secondColumn, rowheight);
          pdf.text('Manufacture Date: ' + moment(new Date(this.entitlementArray[index].ManufactureDate)).format('MM/DD/YYYY'), leftPageMargin + thirdColumn, rowheight);

          if (this.entitlementArray[index].StandardCoverage !== '&nbsp;') {
            rowheight = rowheight + lineheight;
            pdf.text('Standard Coverage', 250, rowheight);
            let standardcoverage = this.entitlementArray[index].lines.filter(x => x.Entitlement_Code === 'S');
            standardcoverage = standardcoverage.map(this.pdfEntitlementMap);
            pdf.autoTable(entitlementColumns, standardcoverage, { margin: { top: rowheight + 5 } });
          }


          rowheight = rowheight + lineheight;
          if (this.entitlementArray[index].StandardCoverage !== '&nbsp;') {
            pdf.text('Registered Coverage', 250, pdf.autoTableEndPosY() + 15);
          } else {
            rowheight = rowheight + lineheight;
            pdf.text('Registered Coverage', 250, rowheight);
          }
          let registeredCvg = this.entitlementArray[index].lines.filter(x => x.Entitlement_Code === 'R');
          registeredCvg = registeredCvg.map(this.pdfEntitlementMap);
          if (this.entitlementArray[index].StandardCoverage !== '&nbsp;') {
            //  pdf.autoTable(entitlementColumns, registeredCvg, { margin: { top: pdf.autoTableEndPosY() + 20 } });
            pdf.autoTable(entitlementColumns, registeredCvg, { startY: pdf.autoTableEndPosY() + 20 });
          } else {
            pdf.autoTable(entitlementColumns, registeredCvg, { margin: { top: rowheight + 5 } });
          }

        }
        if (pdf.autoTableEndPosY() > 690 && pdf.autoTableEndPosY() < (2 * 690)) {
          pdf.addPage();
          currentPage = currentPage + 1;
          seconPageRowheight = 50;
          if (currentPage == 0 || currentPage == 1) {
            index = index + 1;
          } else {
            index = index;
          }

        }

        if (currentPage > 0 && index < this.entitlementArray.length) {

          this.addPage(pdf, currentPage, index, leftPageMargin, secondColumn, thirdColumn, lineheight, entitlementColumns, seconPageRowheight);
          seconPageRowheight = pdf.autoTableEndPosY() + lineheight + 20;
        }
      }
    }
    if (param === 'pdf') {
      pdf.save('Registration Certificate.pdf');

    } else {
      const attachment = pdf.output('datauristring');
      const emailbody = 'Thank you for registering your product with us. Attached is a copy of your certificate.';
      const emailTo = this.consumer.Email;
      const emailSubject = 'Registration Certificate';
      const att = attachment.split(',')[1];
      this.registerService.sendEmail(att, emailTo, emailbody, emailSubject).subscribe(resp => {
        if (resp.d.Severity > 0) {
          this.toasterService.pop('Error', '', 'There was processing your request. Please try again later.');
        } else {
          this.toasterService.pop('Success', '', 'Email has been sucessfully sent.');
        }

      });
    }

  }

  addPage(pdf, currentPage, index, leftPageMargin, secondColumn, thirdColumn, lineheight, entitlementColumns, rowheight) {

    if (currentPage > 0) {
      pdf.setFontSize(12);
      pdf.setFontSize(10);
      pdf.setTextColor(100);

      pdf.text('Serial Number: ' + this.entitlementArray[index].SerNum, leftPageMargin, rowheight);
      pdf.text('Model: ' + this.entitlementArray[index].Model, leftPageMargin + secondColumn, rowheight);
      pdf.text('Model Description: ' + this.entitlementArray[index].Modeldesc, leftPageMargin + thirdColumn, rowheight);
      // tslint:disable-next-line:max-line-length
      // pdf.text('Install Date: ' + moment(this.entitlementArray[index].InstallDate).format('MM/DD/YYYY'), leftPageMargin + thirdColumn, rowheight);

      rowheight = rowheight + lineheight;
      pdf.text('Install Date: ' + this.getInstallDate(this.entitlementArray[index].InstallDate), leftPageMargin, rowheight);
      // tslint:disable-next-line:max-line-length
      var regDate = this.entitlementArray[index].RegistrationDate == null ? moment(new Date()).format('MM/DD/YYYY') : moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY');
      pdf.text('Registration Date: ' + regDate, leftPageMargin + secondColumn, rowheight);
      pdf.text('Manufacture Date: ' + moment(new Date(this.entitlementArray[index].ManufactureDate)).format('MM/DD/YYYY'), leftPageMargin + thirdColumn, rowheight);

      if (this.entitlementArray[index].StandardCoverage !== '&nbsp;') {
        rowheight = rowheight + lineheight;
        pdf.text('Standard Coverage', 250, rowheight);
        let standardcoverage = this.entitlementArray[index].lines.filter(x => x.Entitlement_Code === 'S');
        standardcoverage = standardcoverage.map(this.pdfEntitlementMap);
        pdf.autoTable(entitlementColumns, standardcoverage, { margin: { top: rowheight + 5 } });
      }


      rowheight = rowheight + lineheight;
      if (this.entitlementArray[index].StandardCoverage !== '&nbsp;') {
        pdf.text('Registered Coverage', 250, pdf.autoTableEndPosY() + 15);
      } else {
        rowheight = rowheight + lineheight;
        pdf.text('Registered Coverage', 250, rowheight);
      }
      let registeredCvg = this.entitlementArray[index].lines.filter(x => x.Entitlement_Code === 'R');
      registeredCvg = registeredCvg.map(this.pdfEntitlementMap);
      if (this.entitlementArray[index].StandardCoverage !== '&nbsp;') {
        //  pdf.autoTable(entitlementColumns, registeredCvg, { margin: { top: pdf.autoTableEndPosY() + 20 } });
        pdf.autoTable(entitlementColumns, registeredCvg, { startY: pdf.autoTableEndPosY() + 20 });
        registeredCvg
      } else {
        pdf.autoTable(entitlementColumns, registeredCvg, { margin: { top: rowheight + 5 } });
      }
    }
  }

  pdfEntitlementMap(currValue) {
    currValue.EndDate = moment(currValue.CoverageEndDate).format('MM/DD/YYYY');
    currValue.StartDate = moment(currValue.CoverageStartDate).format('MM/DD/YYYY');
    if (currValue.Coverage_Type === 'L') {
      currValue.Coverage_Type = 'Labor';
    }
    if (currValue.Coverage_Type === 'P') {
      currValue.Coverage_Type = 'All Parts';
    }
    if (currValue.Coverage_Type === 'CP') {
      currValue.Coverage_Type = 'Compressor';
    }
    if (currValue.Coverage_Type === 'U') {
      currValue.Coverage_Type = 'Unit Replacement';
    }
    if (currValue.Coverage_Type === 'HE') {
      currValue.Coverage_Type = 'Heat Exchanger';
    }
    return currValue;
  }
  getInstallDate(instDate){
    let uInstalldate =  moment(instDate).format('MM/DD/YYYY')
    var uinstDate =   timezone(moment(instDate));
    let isPDT =  uinstDate.tz('America/Los_Angeles').format('ha z');
    if(isPDT.indexOf('PDT') > 0){
      moment(instDate).add(5, 'hours').format('MM/DD/YYYY');
      uInstalldate =moment(instDate).add(5, 'hours').format('MM/DD/YYYY');
    }
    return uInstalldate;
  }
}

