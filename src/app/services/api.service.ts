
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    // tslint:disable-next-line: deprecation
    private http: Http
  ) {}


  warrantypost(body): Observable<any> {
    return this.http.post(
      `${environment.webserviceurl}`,
     body
    ).pipe(map((resp => resp.json())));
  }
}
