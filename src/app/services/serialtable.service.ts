
import { Injectable } from '@angular/core';
import {   Headers } from '@angular/http';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Jsonp } from '@angular/http/src/http';
import { Unit } from '../interface/serialdetail.interface';
import { ConsumerEntity } from '../interface/serialdetail.interface';
import {  Dealer } from '../interface/serialdetail.interface';
import { RegistrationUnit } from '../interface/serialdetail.interface';
import {environment} from '../../environments/environment';
// tslint:disable-next-line:import-blacklist

import { of, Subject, Observable } from 'rxjs';;
@Injectable()
export class SerialTableService {
     private subject = new Subject<any>();
     private unitsToRegister = new Array<Unit>();
     private unitsToRegisterReal = new Array<Unit>();


    addSerialToRegister(unit: Unit) {
        console.log('addSerialToRegister');
        this.unitsToRegisterReal.push(unit);
        return of(this.unitsToRegisterReal);
        //  this.subject.next(this.unitsToRegister);
    }
    reset(){
        this.unitsToRegister.length = 0;
        this.unitsToRegisterReal.length = 0;
        return of(this.unitsToRegister);
    }
    validateSerial() { 
         return of(this.unitsToRegisterReal);
    }
    unitsToRegisterValidate(arrrayUnit: Array<Unit>) {
        return of(this.unitsToRegisterReal);
   }
    addSerial(unit: Unit) {
        this.unitsToRegister.push(unit);
       // this.subject.next(this.unitsToRegister);
        return of(this.unitsToRegister);
    }

    removeSerial(unit: Unit){
        const index = this.unitsToRegister.findIndex(opt => opt.serialnumber === unit.serialnumber && opt.item === unit.item);
        if (index > -1 ) {
            this.unitsToRegister.splice(index, 1);
        }
        const ind = this.unitsToRegisterReal.findIndex(opt => opt.serialnumber === unit.serialnumber && opt.item === unit.item);
        if (ind > -1 ) {
            this.unitsToRegisterReal.splice(ind, 1);
        }
       // return  Observable.of(this.unitsToRegister);
    }
    removeItem(serialnumber, item){
        const index = this.unitsToRegister.findIndex(opt => opt.serialnumber ===serialnumber && opt.item === item);
        if (index > -1 ) {
            this.unitsToRegister.splice(index, 1);
           }
       // return  Observable.of(this.unitsToRegister);
    }

    getSerial(){
        return of(this.unitsToRegister);
    }
}
