
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Unit } from '../interface/serialdetail.interface';
import { ConsumerEntity } from '../interface/serialdetail.interface';
import { Dealer } from '../interface/serialdetail.interface';
import { RegistrationUnit } from '../interface/serialdetail.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IpAddressService } from './ipAddress.service';

@Injectable()
export class RegisterService {
    deviceInfo = null;
    device='';
    headers: Headers;
    ipAddr: string;
    url: string = environment.webserviceurl;
    private static handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            if (error.status === 404) {
                errMsg = `Resource ${error.url} was not found`;
            } else {
                const body = error.json() || '';
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        // tslint:disable-next-line: deprecation
        return Observable.throw(errMsg);
    }

    constructor(
        private http: Http,
        private apiService: ApiService,
        private ipAddress: IpAddressService,
        private deviceService: DeviceDetectorService
    ) {

        this.ipAddress.getIpAddress('').subscribe(data =>  { console.log( data.ip); this.ipAddr = data.ip });
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        this.device = isMobile == true?'Mobile':isTablet==true?'Tablet':isDesktopDevice==true?'Desktop':'Unknown';
    }

    // tslint:disable-next-line:one-line
    getItemsFor(serialnumber: string): Observable<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });


        const Type = 'LookupModelBySerNumRequest:http://goodmanmfg.com/GMC/WebService/BP/Warranty/LookupService';
        const req = {
            'request': {
                '__type': Type,
                'TokenID': '60929208-d1b3-4814-a390-c4061a374d79',
                'SerNum': serialnumber,
                'ItemType': 'M'
            }
        };
        return this.apiService.warrantypost(req);


    }
    validateItem(serialnumber: string, item: string): Observable<any> {
        console.log('validate item');
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });
        const Type = 'ValidateRegisterRequest:http://goodmanmfg.com/GMC/WebService/BP/Warranty/Entities/ValidationService';
        const req = {
            'request': {
                '__type': Type,
                'TokenID': '60929208-d1b3-4814-a390-c4061a374d79',
                'ModelNumber': item,
                'SerialNumber': serialnumber
            }
        };
      
        return this.apiService.warrantypost(req);
    }
//TODO -- validate phone number


    validatePhoneNumber(phone:string): Observable<any>{
        console.log('validate phonenumber');
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });
        const Type = 'ValidatePhoneNumberRequest:http://goodmanmfg.com/GMC/WebService/BP/Warranty/Entities/ValidationService';
        const req = {
            'request': {
                '__type': Type,
                'TokenID': '60929208-d1b3-4814-a390-c4061a374d79',
                'PhoneNumber': phone
            }
        };
        return this.apiService.warrantypost(req);
    }
    zipcodeLookup(zipcode: string): Observable<any> {
        console.log('zipcodeLookup');
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });
        const Type = 'LookupStateRequest:http://goodmanmfg.com/GMC/WebService/BP/Warranty/LookupService';
        const req = {
            'request': {
                '__type': Type,
                'TokenID': '60929208-d1b3-4814-a390-c4061a374d79',
                'ZipCode': zipcode
            }
        };
        return this.apiService.warrantypost(req);
    }

    registerUnitsFor(
        consumer: ConsumerEntity,
        dealer: Dealer,
        units: Array<RegistrationUnit>,
        isdirectComortSerial: Boolean
    ): Observable<any> {
        console.log('register units');
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });
        const Type = 'RegisterSystemRequest:http://goodmanmfg.com/GMC/WebService/BP/Warranty/Entities/RegistrationService';
        const req = {
            'request': {
                '__type': Type,
                'Consumer': consumer,
                'Units': units,
                'TokenID': '60929208-d1b3-4814-a390-c4061a374d79',
                'IPAdress': this.ipAddr,
                'Source': 'WRG',
                'SourceDescription': null,
                'installer_addr1': dealer.Address1,
                'installer_addr2': dealer.Address2,
                'installer_city': dealer.City,
                'installer_state': dealer.State,
                'installer_zip': dealer.ZipCode,
                'installer_country': dealer.Country,
                'CustNum': null,
                'CustSeq': 0,
                'ChangetoDirectComfort': isdirectComortSerial
            }
        };
        // return this.http.post(this.url, req, { headers: this.headers })
        //     .map(response => response.json()
        //     );
        return this.apiService.warrantypost(req);
    }

    getEntitlement(sernum, model, lastname): Observable<any> {
        console.log('get entitlement');
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });
        const Type = 'RetrieveEntitlementTableRequest:http://goodmanmfg.com/GMC/WebService/BP/Warranty/Entities/EntitlementService';
        const req = {
            'request': {
                '__type': Type,
                'TokenID': '60929208-d1b3-4814-a390-c4061a374d79',
                'SerNum': sernum,
                'Model': model,
                'InstallType': 'RES',
                'LastName': lastname
            }
        };

        return this.apiService.warrantypost(req);

    }

    sendEmail(attachment, emailTo, emailbody, emailSubject): Observable<any> {
        console.log('send email');
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });
        const Type = 'EmailServiceRequest:http://goodmanmfg.com/GMC/WebService/BP/Warranty/Entities/RegistrationService';
        const req = {
            'request': {
                '__type': Type,
                'TokenID': '60929208-d1b3-4814-a390-c4061a374d79',
                'Attachment': attachment,
                'EmailAddress': emailTo,
                'EmailBody': emailbody,
                'EmailSubject': emailSubject,
                'FileName': 'Registration Certificate'
            }
        };
        return this.apiService.warrantypost(req);

    }
    removeItem(unitsToRegister: Array<Unit>, unit: Unit): Observable<Unit[]> {

        const index = unitsToRegister.findIndex(opt => opt.serialnumber === unit.serialnumber && opt.item === unit.item);
        unitsToRegister.splice(index, 1);
        return of(unitsToRegister);

    }


}
