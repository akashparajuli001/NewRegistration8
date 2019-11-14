// tslint:disable-next-line:max-line-length
import { Component, OnInit, ViewChild, EventEmitter, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import 'rxjs/operators/startWith';
import 'rxjs/operators/map';
import { MatTableDataSource } from '@angular/material';
import { RegisterService } from '../../services/register.service';
import { Unit, ConsumerEntity, Dealer, RegistrationUnit, Entitlement } from '../../interface/serialdetail.interface';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { CustomValidators } from 'ng2-validation';
import { MatDialog } from '@angular/material';
import 'rxjs/add/observable/of';
import { DailogContentProductComponent } from '../dailog-content-product/dailog-content-product.component';
import { DailogContentUnitcoverageComponent } from '../dailog-content-unitcoverage/dailog-content-unitcoverage.component';
import { DailogContentConfirmationComponent } from '../dailog-content-confirmation/dailog-content-confirmation.component';
import * as moment from 'moment'; //
import * as timezone from 'moment-timezone'; //
import { environment } from '../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as print from 'print-js';
import swal from 'sweetalert';
import { DynamicScriptLoaderService } from 'src/app/services/dynamicscriptloader.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { feedBazaarToSendEmail } from 'src/app/BV/baazar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { feedBazaarToSendEmail } from '../../../assets/js/baazar';
declare let jsPDF;
declare var $: any;

@Component({
  selector: 'reg-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.scss']
})
export class WebLayoutComponent implements OnInit, OnDestroy {


  //  htmlStr: string;
  isLinear = true;
  // isActiveSeriAddBtn = ' ';
  // setting up formGroup
  deviceInfo = null;
  productInfoFromGroup: FormGroup;
  dealerInfoFormGroup: FormGroup;
  customerInfoFormGroup: FormGroup;
  itemControl: FormControl = new FormControl();
  isCommericalType: boolean;
  // AutoComplete Options variable
  options = [];
  filteredOptions: Observable<string[]>;
  // Button Variable
  disableAddSerial = true;
  IsDaikinUnit = false;
  hasMailingAddress = false;
  WarningColor = '#ff0000';
  phoneRegex = '^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$';
  // Setting up material table
  dataSource = new MatTableDataSource();
  displayedColumns = ['serialnumber', 'item', 'modeldesc', 'symbol'];
  private serialtableObservable = new BehaviorSubject<Unit[]>([]);
  private agreeToAnnualMaintence = 0;
  // Setting up Entitites
  unit: Unit;
  consumer: ConsumerEntity;
  installer: Dealer;
  entitlement: Entitlement;
  entitlements: Observable<Entitlement[]>;
  entitlementArray = new Array<Entitlement>();
  responseUnitArray = new Array<RegistrationUnit>();
  unitsToRegister = new Array<Unit>();
  isDirectComfortSerial = false;
  daikinSerialWithUnitCoverage = false;
  doesUnithasUnitExchangeCoverage = false;
  invalidPhone = false;
  // focus emitter for firstname
  focusTriggerEmitter = new EventEmitter<boolean>();
  entitlementlines: any;
  registrationCertificatePdf: any;
  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeout: 9000
    });

  private systemErrorMessage = 'The system has encountered an error. IT has been notified. Please retry later';
  @ViewChild('firstname', {static: false}) firstNameElement: ElementRef;
  @ViewChild('pdfContent', {static: false}) pdfContent: ElementRef;
  @ViewChild('serialTable', {static: false}) serialTable: ElementRef;

  maxDate = new Date();
  baazarVoiceUrl: any;

  // tslint:disable-next-line: variable-name
  constructor(private _formBuilder: FormBuilder,
              private registerService: RegisterService,
              private cdr: ChangeDetectorRef,
              public dialog: MatDialog,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              private ngxService: NgxUiLoaderService,
              private toasterService: ToasterService) {

    // Matthew.Cantillon@goodmanmfg.com
    // {"orderId" :"4775853","city" :"Houston","state" :"TX","country" :"United States","email" :"akash.parajuli@goodmanmfg.com","nickname" :"test","items":[{"sku" :"CAPF36"} ]});

    //  console.log(feedBazaarToSendEmail("test"));
    // var baazarData =  {
    //   "orderId" :"4775853",
    //   "city":"Houston",
    //   "state" :"TX",
    //   "country" :"United States",
    //   "email" :"Matthew.Cantillon@goodmanmfg.com",
    //   "nickname" :"test",
    //   "itemnumber":{"sku" :"CAPF36"}
    //  };
    //  feedBazaarToSendEmail(baazarData.orderId,baazarData.city,baazarData.state,baazarData.country,baazarData.nickname,baazarData.email,baazarData.itemnumber.sku);
    //   for (let index = 0; index < 15; index++) {
    //     this.entitlement = {

    //       InstallDate: new Date(),
    //       ManufactureDate: new Date().toDateString(),
    //       Model: "CHPF3743C6",
    //       Modeldesc: "HORIZ A-COIL 37K-43K 21.0",
    //       RegisteredCoverage: "<table border='1' class='reg'><thead><tr><th colspan='4'>* Registered Standard Coverage</th></tr><tr><th>Coverage Type</th><th>Description</th><th>Effective Start</th><th>End Date</th></tr></thead><tbody><tr><td>All Parts</td><td>10 YEARS PARTS</td><td>09/28/2018</td><td>09/28/2028</td></tr><tr><td>All Parts</td><td>10 YEARS PARTS</td><td>09/28/2018</td><td>09/28/2028</td></tr><tr><td>All Parts</td><td>10 YEARS PARTS</td><td>09/28/2018</td><td>09/28/2028</td></tr></tbody></table>",
    //       RegistrationDate: new Date().toDateString(),
    //       SerNum: "1708011035"+ index.toString(),
    //       StandardCoverage: "<table border='1'class='reg'><thead><tr><th>* Registered Standard Coverage</th></thead><tbody><tr><td>Last name must be entered to verify coverage</td></tr></tbody></table>",
    //       lines:[{
    //       CoverageEndDate: new Date(),
    //       CoverageStartDate:  new Date(),
    //       Coverage_Type: "All Parts",
    //       Description: "10 YEARS PARTS",
    //       EndDate: "09/28/2028",
    //       Entitlement_Code: "R",
    //       },



    //       {
    //         CoverageEndDate: new Date(),
    //         CoverageStartDate:  new Date(),
    //         Coverage_Type: "All Parts",
    //         Description: "10 YEARS PARTS",
    //         EndDate: "09/28/2028",
    //         Entitlement_Code: "R",
    //         }




    //     ]

    //   }
    //   this.entitlementArray.push(this.entitlement);
    //   this.entitlements = Observable.of(this.entitlementArray);
    // }



    // //TODO
    // this.deviceInfo = this.deviceService.getDeviceInfo();

  }
  callEntitlemenOnly() {

    this.consumer = {
      AddrType: 'R',
      Address1: '212 MAIN STREET',
      Address2: '',
      City: 'Houston',
      CompanyName: '',
      Country: 'United States',
      Email: 'A@GMAIL.COM',
      FirstName: 'TEST',
      LastName: 'TEST',
      MailingAddress: {},
      PhoneNumber: '7418529632',
      Source: 'WRG',
      UsrNum: null,
      UsrSeq: null,
      Zip: '77057',
      receive_emails: 1,
      state: 'TX'
    };

    this.installer = { Name: 'test', Phone: '7418529632' };
    this.responseUnitArray = [{
      SerNum: '1605016497',
      Item: 'ASZ160481',

    },
    {
      SerNum: '1605016450',
      Item: 'ANX140361',

    },
    {
      SerNum: '1605016499',
      Item: 'ASZ160481',

    },
    {
      SerNum: '1605016498',
      Item: 'ASZ160481',

    },
    {
      SerNum: '1605016495',
      Item: 'ASZ160481',

    },
    {
      SerNum: '1605016496',
      Item: 'ASZ160481 ',

    },
    ];
    for (const unit of this.responseUnitArray) {
      const lastname = 'test';
      this.registerService.getEntitlement(unit.SerNum, unit.Item, lastname).subscribe(
        response => {
          if (response.d.Severity > 0) {
            // this.toasterService.pop('error', '', 'There was a an error. Call customer service.');
            swal('Error', 'There was a an error. Call customer service.', 'error');
     
            this.ngxService.stop();
          } else {
            this.ngxService.stop();

            this.entitlement = {
              SerNum: response.d.SerNum,
              Model: response.d.Model,
              Modeldesc: response.d.ModelDescription,
              // tslint:disable-next-line: max-line-length
              RegistrationDate: response.d.RegisterDate == null ? new Date().toDateString() : this.converToJsonDate(response.d.RegisterDate).toDateString(),
              InstallDate: this.converToJsonDate(response.d.InstallDate),
              ManufactureDate: this.converToJsonDate(response.d.MfgDate).toDateString(),
              StandardCoverage: response.d.StandardDesktop,
              RegisteredCoverage: response.d.RegisteredDesktop,
              lines: response.d.entitlementlines

            };
            this.entitlementArray.push(this.entitlement);
          }

        },
        () => {
          this.ngxService.stop();
          //  this.toasterService.pop('error', '', this.systemErrorMessage);
          swal('Error', this.systemErrorMessage, 'error');
        });
    }
    this.entitlements = of(this.entitlementArray);
  }
  ngOnDestroy() {
    this.serialtableObservable.unsubscribe();
    this.entitlementArray.length = 0;
    this.unitsToRegister.length = 0;
    this.consumer = {};



  }

  private loadBaazarScripts(company) {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.load(company).then(data => {
      // var baazarData = {
      //   "orderId": "4775853",
      //   "city": 'Houston',
      //   "state": 'TX',
      //   "country": 'USA',
      //   "email": "akash.parajuli001@gmail.com",//"Jason.kosarek@gmail.com",//'matt.cantillon@gmail.com', //
      //   "nickname": "Test Test",
      //   "itemnumber": { "sku": "CAPF36" }
      // };
      // feedBazaarToSendEmail(baazarData);
      this.sendProductReviewEmailByBaazar();
    }).catch(error => console.log(error));


    // $BV.SI.trackTransactionPageView(
    // tslint:disable-next-line: max-line-length
    //   {"orderId" :"4775853","city" :"Houston","state" :"TX","country" :"United States","email" :"akash.parajuli@goodmanmfg.com","nickname" :"test","items":[{"sku" :"CAPF36"} ]});
  }
  onEmailAddressChange(value) {
    if (value != '') {
      this.customerInfoFormGroup.get('emailCtrl').setValidators([CustomValidators.email]);
    } else {
      // tslint:disable-next-line: no-string-literal
      this.customerInfoFormGroup.controls['emailCtrl'].clearValidators();
      // tslint:disable-next-line: no-string-literal
      this.customerInfoFormGroup.controls['emailCtrl'].updateValueAndValidity();
      console.log('empty');
    }
  }
  ngOnInit() {
    // this.callEntitlemenOnly();
    console.log('In Weblayout');
    this.productInfoFromGroup = this._formBuilder.group({
      serialNumber: [''],
      installDate: [''],
      installType: ['', Validators.required]
    });
    this.dealerInfoFormGroup = this._formBuilder.group({
      dlrNameCtrl: ['', Validators.required],
      dlrPhoneCtrl: ['', Validators.pattern(this.phoneRegex)]
    });
    this.customerInfoFormGroup = this._formBuilder.group({
      firstNameCtrl: [''],
      lstNameCtrl: [''],
      businesNameCtrl: ['', Validators.maxLength(25)],
      addr1Ctrl: ['', Validators.required],
      addr2Ctrl: [''],
      zipCtrl: ['', Validators.required],
      cityCtrl: ['', Validators.required],
      stateCtrl: ['', [Validators.required, Validators.maxLength(2)]],
      phoneCtrl: ['', Validators.pattern(this.phoneRegex)],
      emailCtrl: ['', CustomValidators.email],
      countryCtrl: ['United States', Validators.required],
      mailingAddressChkBoxContrl: [''],
      mailingAddr1Ctrl: [''],
      mailingAddr2Ctrl: [''],
      mailingZipCtrl: [''],
      mailingCityCtrl: [''],
      mailingStateCtrl: [''],
      mailingCountryCtrl: ['United States']
    });

    this.customerInfoFormGroup.controls.mailingAddressChkBoxContrl.valueChanges.subscribe(value => {

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
        this.customerInfoFormGroup.controls.mailingAddr1Ctrl.clearValidators();
        this.customerInfoFormGroup.controls.mailingAddr1Ctrl.updateValueAndValidity();
        this.customerInfoFormGroup.controls.mailingZipCtrl.clearValidators();
        this.customerInfoFormGroup.controls.mailingZipCtrl.updateValueAndValidity();
        this.customerInfoFormGroup.controls.mailingCityCtrl.clearValidators();
        this.customerInfoFormGroup.controls.mailingCityCtrl.updateValueAndValidity();
        this.customerInfoFormGroup.controls.mailingStateCtrl.clearValidators();
        this.customerInfoFormGroup.controls.mailingStateCtrl.updateValueAndValidity();
        this.customerInfoFormGroup.controls.mailingCountryCtrl.clearValidators();
        this.customerInfoFormGroup.controls.mailingCountryCtrl.updateValueAndValidity();
      }
      this.productInfoFromGroup.controls.installType.valueChanges.subscribe(() => {
        this.productInfoFromGroup.get('installDate').setValidators([Validators.required]);
      });


      this.cdr.detectChanges();
    });



    this.productInfoFromGroup.controls.installType.valueChanges.subscribe((installTypVal) => {
      if (installTypVal == 'COM') {

        this.isCommericalType = true;
        this.customerInfoFormGroup.controls.firstNameCtrl.clearValidators();
        this.customerInfoFormGroup.controls.firstNameCtrl.updateValueAndValidity();
        this.customerInfoFormGroup.controls.lstNameCtrl.clearValidators();
        this.customerInfoFormGroup.controls.lstNameCtrl.updateValueAndValidity();


        this.customerInfoFormGroup.get('businesNameCtrl').setValidators([Validators.required]);

      }
      // tslint:disable-next-line:one-line
      else {

        this.customerInfoFormGroup.get('firstNameCtrl').setValidators([Validators.required]);
        this.customerInfoFormGroup.get('lstNameCtrl').setValidators([Validators.required]);

        this.customerInfoFormGroup.controls.businesNameCtrl.clearValidators();
        this.customerInfoFormGroup.controls.businesNameCtrl.updateValueAndValidity();
        this.isCommericalType = false;
      }

    });

  }

  onChange(event) {

    const value = event.target.value;
    const installDt = moment(value);
    if (installDt.isValid) {
      this.validateSerialTable(installDt.toDate());
    }
  }


  /**** Click functions  */
  startNewRegistration(stepper) {
    this.unitsToRegister.length = 0;
    this.dataSource.data.length = 0;
    this.entitlementArray.length = 0;
    this.daikinSerialWithUnitCoverage = false;
    stepper.reset();
  }



  addAnotherUnitClick(stepper) {
    this.unitsToRegister.length = 0;
    this.dataSource.data.length = 0;
    this.entitlementArray.length = 0;
    this.productInfoFromGroup.reset();
    this.itemControl.reset();
    this.daikinSerialWithUnitCoverage = false;
    stepper.selectedIndex = 0;
  }
  onDeleteClick(serialnumber, item) {
    const index = this.unitsToRegister.findIndex(opt => opt.serialnumber === serialnumber && opt.item === item);

    if (index > -1) {
      this.unitsToRegister.splice(index, 1);
    }
    this.dataSource.data = this.unitsToRegister;
  }
  addSerial(): void {
    if (this.unitsToRegister.length > 10) {
      // tslint:disable-next-line: max-line-length
      //  this.toasterService.pop('', '', "You have reached the maximum number of serial numbers. Please register this serial number in a separate transaction.");

      // tslint:disable-next-line: max-line-length
      swal('Maximum number reached!', 'You have reached the maximum number of serial numbers. Please register this serial number in a separate transaction..', 'warning');
      return;
    }

    const serialnumber = this.productInfoFromGroup.value.serialNumber;
    const item = this.itemControl.value;

    const exists = this.dataSource.data.filter(
      x => x['serialnumber'] === serialnumber && x['item'] === item
    );

    if (exists.length > 0) {
      // this.toasterService.pop('error', '', 'Already exists. Please enter different serial number.');
      swal('Already exists!', 'Serial number already exists. Please enter different serial number.', 'error');
      return;
    }
    this.ngxService.start();
    console.log('add serial');
    this.registerService.validateItem(serialnumber, item)
      .subscribe(
        response => {
          console.log(response);
          const severity = response.d.Severity;
          this.ngxService.stop();
          if (severity > 0) {
            let errMsg = response.d.Error.Message;
            // this.toasterService.pop('error', '', response.d.Error.Message);
            if (errMsg.indexOf('registered') > 0) {
              // tslint:disable-next-line: max-line-length
              errMsg = 'This unit has already been registered. Please follow the below link to confirm registration.<br> <a target="_blank" href="https://www.goodmanmfg.com/warranty-lookup">Click here.</a>';
              swal({
                title: 'Error',
                icon: 'error',
                content: {
                  element: 'div',
                  attributes: {
                    innerHTML: errMsg
                  },
                }
              });
            } else {
              swal('Warning', errMsg, 'warning');
            }





          } else {
            this.saveSerialInfo(this.unit);
            this.serialtableObservable.subscribe(data => {
              this.dataSource.data = data.reverse();
            });
            this.disableAddSerial = true;
            this.productInfoFromGroup.setValue({
              serialNumber: '',
              installDate: this.productInfoFromGroup.value.installDate
              , installType: this.productInfoFromGroup.value.installType
            });
            this.itemControl.reset();
            if (this.productInfoFromGroup.value.installDate !== '') {
              this.validateSerialTable(this.productInfoFromGroup.value.installDate);
            }

          }
        }, () => {
          this.ngxService.stop();
          // this.toasterService.pop('error', '', this.systemErrorMessage);
          swal('Error', this.systemErrorMessage, 'error');
        });
  }
  onClickProductNextButton(stepper) {
    if (this.productInfoFromGroup.value.installDate === '') {
      // this.toasterService.pop('error', '', 'Install Date is required');
      swal('Error', 'Install Date is required.', 'error');
      this.productInfoFromGroup.setErrors({ invalid: true });
      return false;
    }
    const result = this.validateSerialTable(this.productInfoFromGroup.value.installDate);
    if (!result) {
      return false;
    }
    for (const el of this.unitsToRegister) {
      if (el.Manufacturer === 'Daikin') {
        this.IsDaikinUnit = true;
        break;
      }
    }
    this.openProductDialog(stepper);

  }
  registerUnit(stepper) {



    this.consumer = {
      Address1: this.customerInfoFormGroup.controls.addr1Ctrl.value,
      Address2: this.customerInfoFormGroup.controls.addr2Ctrl.value,
      FirstName: this.customerInfoFormGroup.controls.firstNameCtrl.value,
      LastName: this.customerInfoFormGroup.controls.lstNameCtrl.value,
      City: this.customerInfoFormGroup.controls.cityCtrl.value,
      state: this.customerInfoFormGroup.controls.stateCtrl.value,
      Zip: this.customerInfoFormGroup.controls.zipCtrl.value,
      Email: this.customerInfoFormGroup.controls.emailCtrl.value,
      PhoneNumber: this.customerInfoFormGroup.controls.phoneCtrl.value,
      CompanyName: this.customerInfoFormGroup.controls.businesNameCtrl.value,
      Country: this.customerInfoFormGroup.controls.countryCtrl.value,
      Source: 'WRG',
      receive_emails: 1,
      AddrType: this.productInfoFromGroup.controls.installType.value === 'COM' ? 'B' : 'R',
      UsrNum: null,
      UsrSeq: null,
      MailingAddress: this.hasMailingAddress === true ? {
        FirstName: this.customerInfoFormGroup.controls.firstNameCtrl.value,
        LastName: this.customerInfoFormGroup.controls.lstNameCtrl.value,
        StreetAddress1: this.customerInfoFormGroup.controls.mailingAddr1Ctrl.value,
        StreetAddress2: this.customerInfoFormGroup.controls.mailingAddr2Ctrl.value,
        City: this.customerInfoFormGroup.controls.mailingCityCtrl.value,
        State: this.customerInfoFormGroup.controls.mailingStateCtrl.value,
        ZipCode: this.customerInfoFormGroup.controls.mailingZipCtrl.value,
        Country: this.customerInfoFormGroup.controls.mailingCountryCtrl.value,
      } : {}
    };

    this.installer = {
      Name: this.dealerInfoFormGroup.controls.dlrNameCtrl.value,
      Phone: this.dealerInfoFormGroup.controls.dlrPhoneCtrl.value
    };
    let registrationUnit: RegistrationUnit;
    const registrationUnits = new Array<RegistrationUnit>();
    this.unitsToRegister.forEach(element => {
      const installDate = new Date(this.productInfoFromGroup.controls.installDate.value);
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
        InstallType: this.productInfoFromGroup.controls.installType.value,
        InstallDate: '\/Date(' + installDate.valueOf() + ')\/', // -- commented out may need change
        Installer: this.installer.Name,
        ComponentType: 0,
        Type: '',
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
 
    // tslint:disable-next-line: max-line-length
    this.registerService.registerUnitsFor(this.consumer, this.installer, registrationUnits, this.isDirectComfortSerial).subscribe(
      response => {

        if (response.d.Severity > 0) {
          // this.toasterService.pop('error', '', response.d.Error.Message);
          swal('Error', this.systemErrorMessage, 'error');
          this.ngxService.stop();
        } else {

          this.responseUnitArray = response.d.Units;
          this.callEntitlement(stepper);


        }

      }, () => {
        this.ngxService.stop();
        // this.toasterService.pop('error', '', this.systemErrorMessage);
        swal('Error', this.systemErrorMessage, 'error');
      });

  }
  private testBazar() {
    // tslint:disable-next-line: prefer-const
    let baazarData = {
      orderId : '55555',
      tax : '0',
      shipping : '0',
      total : '0',
      city : 'Houston',
      state : 'TX',
      country : 'USA',
      currency : 'USD',
      items : [
          {

            price : '140', // (individual price of item, not price X quantity, without the $ sign)
            quantity : '1',
            productId : '156278', // (ExternalId in product feed)


          },

      ],
      email : 'akash.parajuli@goodmanmfg.com',


    };
    // tslint:disable-next-line: prefer-const
    let PIPMfg = 'goodman';
    feedBazaarToSendEmail(baazarData);
    // this.loadBaazarScripts(PIPMfg);

    // feedBazaarToSendEmail(baazarData);
  }
  private sendProductReviewEmailByBaazar() {
    const items = [];
    this.responseUnitArray.forEach(element => {
      items.push({
        sku: element.Item,
        quantity: this.responseUnitArray.length.toString(),
        price : '0.00'
      });
    });
    const orderId = this.getRandomNumber();
    const baazarData = {
      orderId: orderId.toString(),
      city: this.consumer.City,
      state: this.consumer.state,
      country: this.consumer.Country,
      email: this.consumer.Email,
      nickname: this.consumer.FirstName,
      total: items.length.toString(), // required field
      currency: 'USD', // required field
      items// {"sku" :"CAPF36"}
    };

    if (this.consumer.Email != '') {
      feedBazaarToSendEmail(baazarData);
    }

  }

  openConfirmationDialog(stepper) {
    const dialogRef = this.dialog.open(DailogContentConfirmationComponent, {

      data: {
        unitsToRegister: this.unitsToRegister,
        customerInfo: this.consumer = {
          Address1: this.customerInfoFormGroup.controls.addr1Ctrl.value,
          Address2: this.customerInfoFormGroup.controls.addr2Ctrl.value,
          FirstName: this.customerInfoFormGroup.controls.firstNameCtrl.value,
          LastName: this.customerInfoFormGroup.controls.lstNameCtrl.value,
          City: this.customerInfoFormGroup.controls.cityCtrl.value,
          state: this.customerInfoFormGroup.controls.stateCtrl.value,
          Zip: this.customerInfoFormGroup.controls.zipCtrl.value,
          PhoneNumber: this.customerInfoFormGroup.controls.phoneCtrl.value,
          CompanyName: this.customerInfoFormGroup.controls.businesNameCtrl.value

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
  getRandomNumber() {
    return  Math.floor(100000 + Math.random() * 900000);
  }
  openUnitCoverageDialog(stepper) {


    if (this.daikinSerialWithUnitCoverage && this.productInfoFromGroup.controls.installType.value == 'RES') {
      const dialogRef = this.dialog.open(DailogContentUnitcoverageComponent, {
      });

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
  // tslint:disable-next-line: jsdoc-format
  /**End of Click Function**/


  /* OnChange Functions */
  onZipCodeChange(zipcode: string): void {


    this.ngxService.start();
    this.registerService.zipcodeLookup(zipcode).subscribe(
      response => {
        this.ngxService.stop();
        const result = response.d;
        this.customerInfoFormGroup.controls.cityCtrl.setValue(result.City);
        this.customerInfoFormGroup.controls.stateCtrl.setValue(result.State);
        this.customerInfoFormGroup.controls.countryCtrl.setValue(result.Country);

      },
      () => {
        this.ngxService.stop();
        //  this.toasterService.pop('error', '', this.systemErrorMessage);
        swal('Error', this.systemErrorMessage, 'error');
        // tslint:disable-next-line: no-unused-expression
        this.systemErrorMessage;
      }
    );

  }

  // TODO - validate phone number on change.
  onPhoneNumberChange(phone: string) {
    console.log('validate phone number');
    this.ngxService.start();
    this.registerService.validatePhoneNumber(phone).subscribe(
      response => {
        this.ngxService.stop();
        const isValid = response.d.isValid;
        if (!isValid) {
          this.customerInfoFormGroup.controls.phoneCtrl.setErrors({ incorrect: true });
          this.invalidPhone = true;
          this.customerInfoFormGroup.updateValueAndValidity();
          // swal('Error', "Invalid Phone number.", 'error');
        } else {
          this.invalidPhone = false;
        }

      },
      () => {
        this.ngxService.stop();
        //  this.toasterService.pop('error', '', this.systemErrorMessage);
        swal('Error', this.systemErrorMessage, 'error');
        // tslint:disable-next-line: no-unused-expression
        this.systemErrorMessage;
      }
    );
  }
  onMailingZipCodeChange(zipcode: string): void {

    this.ngxService.start();
    this.registerService.zipcodeLookup(zipcode).subscribe(
      response => {
        this.ngxService.stop();
        const result = response.d;
        this.customerInfoFormGroup.controls.mailingCityCtrl.setValue(result.City);
        this.customerInfoFormGroup.controls.mailingStateCtrl.setValue(result.State);
      },
      () => {
        this.ngxService.stop();
        // this.toasterService.pop('error', '', this.systemErrorMessage);
        swal('Error', this.systemErrorMessage, 'error');
      }
    );

  }

  onStateChange(state: string) {
    if (state.length > 2) {
      // this.toasterService.pop('error', '', 'Please abbreviate the state with 2 letters.');
      swal('Error', 'Please abbreviate the state with 2 letters.', 'error');
    }

  }
  onSerialNumberChange(serialnumber: string): void {


    console.log('on serial change');
    const queryString = window.location.href;
    this.ngxService.start();
    this.registerService.getItemsFor(serialnumber).subscribe(
      response => {
        this.ngxService.stop();
        const result = response.d;
        if (result.Severity > 0) {
          this.errorOnValidatingSerial(result);
          return;
        }
        this.options = [];
        if (result.SerNumValid) {
          this.disableAddSerial = false;
          if (result.ItemList.length > 1) {
            // tslint:disable-next-line:forin
            this.itemControl.reset({ value: '', disabled: false });
            // tslint:disable-next-line: prefer-for-of
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
                      // this.toasterService.pop('error', '', 'Serial number is missing manufacture date');
                      swal('Error', 'Serial number is missing manufacture date', 'error');
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
                // tslint:disable-next-line: max-line-length
                if ((this.unit != null && this.daikinSerialWithUnitCoverage == false && (this.unit.Manufacturer.toUpperCase() === 'DAIKIN' && this.unit.HasUnitExchangeCoverage))) {
                  this.daikinSerialWithUnitCoverage = true;
                }
                return selectedVal;
              }

              )
            );
            // tslint:disable-next-line:one-line
          } else {
            // this.myControl = new FormControl({value:'Akash',disabled:true});
            this.itemControl.reset({ value: result.ItemList[0].ItemModel, disabled: true });
            if (this.unitsToRegister.filter(o => o.item === result.ItemList[0].ItemModel
              && o.serialnumber === result.ItemList[0].SerNum).length === 0) {
              console.log('data:' + result.ItemList[0].SerNum);
              // tslint:disable-next-line:radix
              const mfgDate = new Date(parseInt(response.d.ItemList[0].ManufactureDate.substr(6)));
              console.log('MfgDate:' + mfgDate);
              if (mfgDate === null) {
                //  this.toasterService.pop('error', '', 'Serial number is missing manufacture date');
                swal('Error', 'Serial number is missing manufacture date', 'error');
                this.disableAddSerial = true;
                return;
              }
              this.unit = {
                serialnumber: result.ItemList[0].SerNum,
                item: result.ItemList[0].ItemModel,
                modeldesc: result.ItemList[0].ProductCodeDescription,
                Manufacturer: result.ItemList[0].ManufacturerNum,
                ManufactureDate: new Date(mfgDate),
                warning: '',
                HasUnitExchangeCoverage: result.ItemList[0].HasUnitExchangeCoverage
              };
              this.addSerial();
              this.disableAddSerial = true;
              // tslint:disable-next-line: max-line-length
              if ((this.unit != null && this.daikinSerialWithUnitCoverage == false && (this.unit.Manufacturer.toUpperCase() === 'DAIKIN' && this.unit.HasUnitExchangeCoverage))) {
                this.daikinSerialWithUnitCoverage = true;
              }
            }
          }
        }
        // change goodman unit to direct comfort serial if page is opened in direct comfort domain.
        if ((this.unit != null && (this.unit.Manufacturer.toUpperCase() === 'GOODMAN' || this.unit.Manufacturer.toUpperCase() === 'AMANA'))
          // tslint:disable-next-line: no-conditional-assignment
          && (this.isDirectComfortSerial = queryString.indexOf('directcomfort') !== -1)) {
          this.isDirectComfortSerial = true;
        }





      },
      () => {
        this.ngxService.stop();
        // this.toasterService.pop('error', '', this.systemErrorMessage);
        swal('Error', this.systemErrorMessage, 'error');
      }
    );
  }
  /** End On Change Function */


  // tslint:disable-next-line: jsdoc-format
  /**Validation **/
  validateSerialTable(installedDate: Date): boolean {
    let isValid = true;
    this.unitsToRegister.map(x => {
      const differenceInDays = this.daysdifference(installedDate, x.ManufactureDate);
      x.warning = '';
      if (differenceInDays > 1440) {
        x.warning = this.WarningColor;
        // tslint:disable-next-line:max-line-length
        //  this.toasterService.pop('error', '', 'Unable to Process Warranty Registration at this time. Please contact Homeowner Support at 877-254-4729 or 877-688-9191.');
        // tslint:disable-next-line: max-line-length
        swal('Error', 'Unable to Process Warranty Registration at this time. Please contact Homeowner Support at 877-254-4729 or 877-688-9191.', 'error');
        isValid = false;
      }
      if (installedDate < x.ManufactureDate) {
        // tslint:disable-next-line: max-line-length
        //  this.toasterService.pop('error', '', 'Install date entered cannot be less than the date unit ' + x.serialnumber + ' was manufactured.');
        swal('Error', 'Install date entered cannot be less than the date unit ' + x.serialnumber + ' was manufactured.', 'error');

        x.warning = this.WarningColor;
        isValid = false;
      }
      return x;

    });

    return isValid;
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

  errorOnValidatingSerial(result) {
    this.itemControl.reset();
    this.disableAddSerial = true;
    // tslint:disable-next-line: max-line-length
    const template = '<b>Helpful Tips</b>:Your serial # is likely a 10-digit # with no letters.<br>Example: 1905344687.<br>If not, your serial # wil be 7 digits and start with a letter and you will select the correct model. <br>Example G009999';


    swal({
      title: 'The Serial # is invalid',
      icon: 'error',
      content: {
        element: 'div',
        attributes: {
          innerHTML: template
        },
      }
    });
    //   swal('The Serial # is invalid.', '<b>Helpful Tips</b>:Your serial # is likely a 10-digit # with no letters.Example 1905344687.If not, your serial # wil be 7 digits and start with a letter and you will select the correct model. Example G009999', 'warning');
  }

  filter(val: string): string[] {
    if (val == null || val == '') {
      return this.options;
    }
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);

  }

  saveSerialInfo(serialInfo: Unit) {
    this.unitsToRegister.push(serialInfo);
    this.serialtableObservable.next(this.unitsToRegister);
  }

  focusFirstName() {

    setTimeout(() => {
      this.focusTriggerEmitter.emit(true);
    }, 400);

  }

  converToJsonDate(dateValue: string): Date {
    console.log('converToJsonDate');
    console.log(dateValue);
    if (dateValue === null) {
      return null;
    }
    // tslint:disable-next-line:radix
    return new Date(parseInt(dateValue.replace('/Date(', '')));
  }

  daysdifference(date1, date2) {
    const ONEDAY = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    const date1_ms = date1.getTime();
    const date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    const difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms / ONEDAY);
  }

  callEntitlement(stepper) {
    // tslint:disable-next-line:max-line-length
    // this.htmlStr = ` <table class="tblCoverage" border="1" cellpadding="1" cellspacing="1"><thead><tr><th class="theader" colspan="4">* Registered Standard Coverage</th></tr><tr ><th>Coverage Type</th><th>Description</th><th>Effective Start</th><th>End Date</th></tr></thead><tbody><tr><td>All Parts</td><td>10 YEARS PARTS</td><td>05/01/2018</td><td>05/01/2028</td></tr></tbody></table>`;
    for (const unit of this.responseUnitArray) {
      const lastname = this.customerInfoFormGroup.controls.lstNameCtrl.value;
      this.registerService.getEntitlement(unit.SerNum, unit.Item, lastname).subscribe(
        response => {
          if (response.d.Severity > 0) {
            // this.toasterService.pop('error', '', 'There was a an error. Call customer service.');
            swal('Error', 'There was a an error. Call customer service.', 'error');
            this.ngxService.stop();
          } else {
            this.ngxService.stop();
            stepper.next();
            this.entitlement = {
              SerNum: response.d.SerNum,
              Model: response.d.Model,
              Modeldesc: response.d.ModelDescription,
              // tslint:disable-next-line: max-line-length
              RegistrationDate: response.d.RegisterDate == null ? new Date().toDateString() : this.converToJsonDate(response.d.RegisterDate).toDateString(),
              InstallDate: this.converToJsonDate(response.d.InstallDate),
              ManufactureDate: this.converToJsonDate(response.d.MfgDate).toDateString(),
              StandardCoverage: response.d.StandardDesktop,
              RegisteredCoverage: response.d.RegisteredDesktop,
              lines: response.d.entitlementlines

            };
            this.entitlementArray.push(this.entitlement);
          }

        },
        () => {
          this.ngxService.stop();
          //  this.toasterService.pop('error', '', this.systemErrorMessage);
          swal('Error', this.systemErrorMessage, 'error');
        });
    }
    this.entitlements = of(this.entitlementArray);
    const PIPMfg = 'goodman';
    this.loadBaazarScripts(PIPMfg);

  }
  createBazaarVoiceLink() {
  }

  email() {


    if (this.customerInfoFormGroup.controls.emailCtrl.value == '') {
      //  this.toasterService.pop('error', '', 'No homeowner e-mail was provided! Please download the certificate.');
      swal('Error', 'No homeowner e-mail was provided! Please download the certificate.', 'error');
      return;
    }

    this.generateTable('email');
  }
  download() {
    this.generateTable('pdf');
  }
  print() {
    this.generateTable('print');
  }
  setBaazarVoiceLink(item, company) {
    let url = environment.BazzarVoiceUrl;
    if (company.toUpperCase() == 'AMANA') {
      url = url.replace('company', company.toLowerCase() + '-hac');
    } else {
      url = url.replace('company', company.toLowerCase());
    }

    url = url.replace('item', item);
    this.baazarVoiceUrl = url;
  }
  callBazarVoice() {

    // <script type="text/javascript">
    // $BV.SI.trackTransactionPageView(
    // tslint:disable-next-line: max-line-length
    //   {"orderId" :"4775853","city" :"Houston","state" :"TX","country" :"United States","email" :"akash.parajuli@goodmanmfg.com","nickname" :"test","items":[{"sku" :"CAPF36"} ]});
    // </script>

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


        // pdf.text('Install Date: ' unitInstallDate, leftPageMargin, rowheight);
        pdf.text('Install Date: ' + this.getInstallDate(this.entitlementArray[index].InstallDate), leftPageMargin, rowheight);
        // tslint:disable-next-line:max-line-length
        const regDate = this.entitlementArray[index].RegistrationDate == null ? moment(new Date()).format('MM/DD/YYYY') : moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY');
        pdf.text('Registration Date: ' + regDate, leftPageMargin + secondColumn, rowheight);
        // tslint:disable-next-line: max-line-length
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
          // pdf.autoTable(entitlementColumns, registeredCoverageRows, { margin: { top: pdf.autoTableEndPosY() + 20 } });
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
          pdf.text('Model Desc: ' + this.entitlementArray[index].Modeldesc, leftPageMargin + thirdColumn, rowheight);
          // tslint:disable-next-line:max-line-length
          // pdf.text('Install Date: ' + moment(this.entitlementArray[index].InstallDate).format('MM/DD/YYYY'), leftPageMargin + thirdColumn, rowheight);


          rowheight = rowheight + lineheight;
          pdf.text('Install Date: ' + this.getInstallDate(this.entitlementArray[index].InstallDate), leftPageMargin, rowheight);
          // tslint:disable-next-line:max-line-length
          const regDate = this.entitlementArray[index].RegistrationDate == null ? moment(new Date()).format('MM/DD/YYYY') : moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY');
          pdf.text('Registration Date: ' + regDate, leftPageMargin + secondColumn, rowheight);
          // tslint:disable-next-line: max-line-length
          //    pdf.text('Registration Date: ' + moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY'), leftPageMargin + secondColumn, rowheight);
          // tslint:disable-next-line: max-line-length
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
        if (pdf.autoTableEndPosY() > 670 && pdf.autoTableEndPosY() < (2 * 670)) {
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

          // tslint:disable-next-line: max-line-length
          this.addPage(pdf, currentPage, index, leftPageMargin, secondColumn, thirdColumn, lineheight, entitlementColumns, seconPageRowheight);
          seconPageRowheight = pdf.autoTableEndPosY() + lineheight + 20;
        }
      }
    }
    if (param === 'pdf') {
      pdf.save('Registration Certificate.pdf');

    } else if (param === 'print') {
      const attachment = pdf.output('datauristring');
      const att = attachment.split(',')[1];
      print({ printable: att, type: 'pdf', base64: true });
    } else {
      const attachment = pdf.output('datauristring');
      const emailbody = 'Thank you for registering your product with us. Attached is a copy of your certificate.';
      const emailTo = this.consumer.Email;
      const emailSubject = 'Registration Certificate';
      const att = attachment.split(',')[1];
      this.registerService.sendEmail(att, emailTo, emailbody, emailSubject).subscribe(resp => {
        if (resp.d.Severity > 0) {
          // this.toasterService.pop('Error', '', 'There was processing your request. Please try again later.');
          swal('Error', 'There was error on processing your request. Please try again later.', 'error');
        } else {
          //  this.toasterService.pop('Success', '', 'Email has been sucessfully sent.');
          swal('Success', 'Email has been sucessfully sent.', 'success');
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
      pdf.text('Model Desc: ' + this.entitlementArray[index].Modeldesc, leftPageMargin + thirdColumn, rowheight);
      // tslint:disable-next-line:max-line-length
      // pdf.text('Install Date: ' + moment(this.entitlementArray[index].InstallDate).format('MM/DD/YYYY'), leftPageMargin + thirdColumn, rowheight);

      rowheight = rowheight + lineheight;
      pdf.text('Install Date: ' + this.getInstallDate(this.entitlementArray[index].InstallDate), leftPageMargin, rowheight);
      // tslint:disable-next-line:max-line-length
      const regDate = this.entitlementArray[index].RegistrationDate == null ? moment(new Date()).format('MM/DD/YYYY') : moment(new Date(this.entitlementArray[index].RegistrationDate)).format('MM/DD/YYYY');
      pdf.text('Registration Date: ' + regDate, leftPageMargin + secondColumn, rowheight);
      // tslint:disable-next-line: max-line-length
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
        // tslint:disable-next-line: no-unused-expression
        registeredCvg;
      } else {
        pdf.autoTable(entitlementColumns, registeredCvg, { margin: { top: rowheight + 5 } });
      }
    }
  }

  pdfEntitlementMap(currValue) {

    let cvgEdDate = moment(currValue.CoverageEndDate).format('MM/DD/YYYY');
    let cvgStDate = moment(currValue.CoverageStartDate).format('MM/DD/YYYY');

    const ucvgStDate = timezone(moment(currValue.CoverageStartDate));
    const ucvgEdDate = timezone(moment(currValue.CoverageEndDate));

    const isSTPDT = ucvgStDate.tz('America/Los_Angeles').format('ha z');
    const isEDPDT = ucvgEdDate.tz('America/Los_Angeles').format('ha z');
    if (isSTPDT.indexOf('PDT') > 0) {
      moment(currValue.CoverageStartDate).add(5, 'hours').format('MM/DD/YYYY');
      cvgStDate = moment(currValue.CoverageStartDate).add(5, 'hours').format('MM/DD/YYYY');
    }
    if (isEDPDT.indexOf('PDT') > 0) {
      moment(currValue.CoverageEndDate).add(5, 'hours').format('MM/DD/YYYY');
      cvgEdDate = moment(currValue.CoverageEndDate).add(5, 'hours').format('MM/DD/YYYY');
    }
    currValue.EndDate = cvgEdDate;
    currValue.StartDate = cvgStDate;


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
  getInstallDate(instDate) {
    let uInstalldate = moment(instDate).format('MM/DD/YYYY');
    const uinstDate = timezone(moment(instDate));
    const isPDT = uinstDate.tz('America/Los_Angeles').format('ha z');
    if (isPDT.indexOf('PDT') > 0) {
      moment(instDate).add(5, 'hours').format('MM/DD/YYYY');
      uInstalldate = moment(instDate).add(5, 'hours').format('MM/DD/YYYY');
    }
    return uInstalldate;
  }


}
