import { Component, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
//import { saveAs } from 'file-saver/FileSaver';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';

@Injectable()
export class PdfService {
    // tslint:disable-next-line: deprecation
    constructor(private http: Http) { }
  

  saveFile() {

  }
  
}
