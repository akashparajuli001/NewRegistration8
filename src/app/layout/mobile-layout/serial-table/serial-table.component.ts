import { Component, OnInit, Input, Injector } from '@angular/core';
import { Unit } from '../../../interface/serialdetail.interface';
import { RegisterService } from '../../../services/register.service';
import { Observable } from 'rxjs/Observable';
import { SerialTableService } from '../../../services/serialtable.service';

@Component({
  selector: 'reg-serial-table',
  templateUrl: './serial-table.component.html',
  styleUrls: ['./serial-table.component.scss']
})
export class SerialTableComponent implements OnInit {
  _ref: any;
  @Input() unit: Unit;
  serialTable: Observable<Unit[]>;
  // @Input() modelnumber: string;
  // @Input() modeldesc: string;
  constructor(
    private registerService: RegisterService,
    private serialTableService: SerialTableService
  ) {

  }

  ngOnInit() {
    
  }

  onCloseClick(serialTable: any){
    console.log('on close click');
    const unitToRemove = this._ref.instance.unit as Unit;
    this.serialTableService.removeSerial(unitToRemove);
    this._ref.destroy();
  }
}
