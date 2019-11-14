import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'reg-dailog-content-unitcoverage',
  templateUrl: './dailog-content-unitcoverage.component.html',
  styleUrls: ['./dailog-content-unitcoverage.component.scss']
})
export class DailogContentUnitcoverageComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DailogContentUnitcoverageComponent>) { }

  ngOnInit() {
  }

  affirm(){
    this.dialogRef.close('affirm');
  }

  decline(){
    this.dialogRef.close('decline');
  }
}
