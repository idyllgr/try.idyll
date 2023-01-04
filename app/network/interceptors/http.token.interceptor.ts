import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import {JwtStore} from '../../../shared/store/jwt.store';
import {Observable} from 'rxjs';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtStore: JwtStore) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      Accept: 'application/json'
    };
    const token = this.jwtStore.getToken;

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    const request = req.clone({ setHeaders: headersConfig });
      // if (!window.navigator.onLine) {
          // if there is no internet, throw a HttpErrorResponse error
          // since an error is thrown, the function will terminate here
          // return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));

      // } else {
          // else return the normal request
          return next.handle(request);
      // }
    // return next.handle(request);
  }
}

