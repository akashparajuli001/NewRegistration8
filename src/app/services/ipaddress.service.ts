
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';


@Injectable()
export class IpAddressService {
    url= environment.ipUrl;
  constructor(
    private httpClient: HttpClient,
    private http: Http
  ) {}

  

  getIpAddress(body): Observable<any> {
    return this.http.get(this.url)
    .pipe(map((resp => {return resp.json()})));
  }
}