import { Component, OnInit, Inject } from '@angular/core';
import { SerialTableService } from '../../services/serialtable.service';
import { Unit, ConsumerEntity } from '../../interface/serialdetail.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'reg-dailog-content-confirmation',
  templateUrl: './dailog-content-confirmation.component.html',
  styleUrls: ['./dailog-content-confirmation.component.scss']
})
export class DailogContentConfirmationComponent implements OnInit {

   unitsToRegister = new Array<Unit>();
   Customer: ConsumerEntity;
  constructor(
    private serialTableService: SerialTableService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DailogContentConfirmationComponent>
  ) { }

  ngOnInit() {

    console.log(this.data);
    this.unitsToRegister = this.data.unitsToRegister;
    this.Customer =  this.data.customerInfo;
   // this.serialTableService.getSerial().subscribe(x => this.unitsToRegister = x);
   // console.log(this.unitsToRegister);
  }

  affirm(){
    this.dialogRef.close('affirm');
  }

  decline() {
    this.dialogRef.close('decline');
  }

}
