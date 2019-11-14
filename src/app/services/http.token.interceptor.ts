import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const headersConfig = {
  //     'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Headers': 'Content-Type',
  //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  //       "Access-Control-Allow-Origin":"*"
  //   };

  //   const token = this.tokenService.getToken();

  //   // if (token) {
  //   //   headersConfig['Authorization'] = `Token ${token}`;
  //   // }

  //  // const request = req.clone({ setHeaders: headersConfig });
  //   return next.handle(request);


     // tslint:disable-next-line: no-trailing-whitespace
     
  request = request.clone({
    setHeaders: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST ',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return next.handle(request);
  }
// tslint:disable-next-line: eofline
}