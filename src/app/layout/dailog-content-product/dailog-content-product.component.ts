import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'reg-dailog-content-product',
  templateUrl: './dailog-content-product.component.html',
  styleUrls: ['./dailog-content-product.component.scss']
})
export class DailogContentProductComponent implements OnInit {


  constructor(private dialogRef: MatDialogRef<DailogContentProductComponent>) { }

  ngOnInit() {
  }

  continue() {
    this.dialogRef.close('CONTINUE');
  }

  no() {
    this.dialogRef.close('NO');
  }
}
