import { Component, OnInit, Input } from '@angular/core';
import { Entitlement } from '../../interface/serialdetail.interface';
import * as moment from 'moment'; //
import * as timezone from 'moment-timezone'; //
@Component({
  selector: 'reg-product-info-mobile',
  templateUrl: './product-info-mobile.component.html',
  styleUrls: ['./product-info-mobile.component.scss']
})
export class ProductInfoMobileComponent implements OnInit {
  @Input() entitlement: Entitlement;
  constructor() { }

  ngOnInit() {
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
