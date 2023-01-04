import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {Observable, of, Subject, throwError} from 'rxjs';
import {retryWhen, delay, mergeMap, catchError, retry, tap, takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';
import {ErrorObservable} from 'rxjs-compat/observable/ErrorObservable';

@Injectable()
export class ApiService {
  public baseUrl = environment.apiBaseUrl;

  DELAY_MS = Math.random() * (1000 - 500) + 500;
  MAX_RETRIES = 3;
  getGiveUpErrorMsg = ( max_retries: number, status) => status === 429 ?
    'Trying to load ressource over XHR for ' + max_retries + ' times witout success. Give up!': ''


  constructor(private http: HttpClient, private translate: TranslateService) {}

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `<div style="font-size: 15px; text-align: left"><b>Code erreur:</b> ${error.status}<br>
                        <b>Message:</b> ${this.getErrorMessage(error.status)}</div>`;
      console.log('handleError', error.error.message);
    }
    // if(![429, 401].includes(error.status)){
    //   Swal.fire({
    //     title: this.translate.instant('FAILURE!'),
    //     html: errorMessage,
    //     icon: 'error',
    //     heightAuto: false
    //   });
    // }

    return throwError(error);
  }

  getErrorMessage(code){
    switch (code){
      case 0: return this.translate.instant('NO CONNECTION WITH THE SERVER');

      case 400: return this.translate.instant( 'THE SYNTAX OF THE QUERY IS INCORRECT.');
      case 401: return this.translate.instant( 'AUTHENTICATION IS REQUIRED TO ACCESS THE RESOURCE.');
      case 402: return this.translate.instant( 'PAYMENT REQUIRED TO ACCESS THE RESOURCE.');
      case 403: return this.translate.instant( 'THE ACCESS RIGHTS DO NOT ALLOW THE CLIENT TO ACCESS THE RESOURCE.');
      case 404: return this.translate.instant( 'RESOURCE NOT FOUND.');
      case 405: return this.translate.instant( 'REQUEST METHOD NOT ALLOWED.');
      case 406: return this.translate.instant( 'THE REQUESTED RESOURCE IS NOT AVAILABLE IN A FORMAT THAT WOULD RESPECT THE \'ACCEPT\' HEADERS OF THE REQUEST.');
      case 407: return this.translate.instant( 'ACCESS TO THE RESOURCE AUTHORIZED BY IDENTIFICATION WITH THE PROXY.');
      case 408: return this.translate.instant( 'THE CLIENT DID NOT ISSUE A REQUEST WITHIN THE TIME THE SERVER WAS PREPARED TO WAIT.');
      case 413: return this.translate.instant( 'PROCESSING ABORTED DUE TO TOO LARGE A REQUEST.');
      case 422: return this.translate.instant( 'THE ENTITY PROVIDED WITH THE REQUEST IS INCOMPREHENSIBLE OR INCOMPLETE.');
      case 423: return this.translate.instant( 'THE OPERATION CANNOT TAKE PLACE BECAUSE THE RESOURCE IS LOCKED.');
      case 429: return this.translate.instant( 'THE CLIENT HAS MADE TOO MANY REQUESTS.');

      case 500:	return this.translate.instant( 'INTERNAL SERVER ERROR.');
      case 501: return this.translate.instant( 'REQUESTED FUNCTIONALITY NOT SUPPORTED BY THE SERVER.');
      case 502:	return this.translate.instant( 'WHILE ACTING AS A PROXY OR GATEWAY SERVER, THE SERVER RECEIVED AN INVALID RESPONSE FROM THE REMOTE SERVER.');
      case 503:	return this.translate.instant( 'SERVICE UNAVAILABLE SERVICE TEMPORARILY UNAVAILABLE OR UNDER MAINTENANCE.');
      case 504:	return this.translate.instant( 'WAITING TIME FOR A RESPONSE FROM A SERVER TO AN INTERMEDIATE SERVER HAS ELAPSED.');
      case 505:	return this.translate.instant( 'HTTP VERSION NOT MANAGED BY THE SERVER.');
      case 506:	return this.translate.instant( 'NEGOTIATION ERROR.');
      case 507:	return this.translate.instant( 'INSUFFICIENT SPACE TO MODIFY PROPERTIES OR BUILD THE COLLECTION.');
      case 508:	return this.translate.instant( 'LOOP IN RESOURCE MATCHING (RFC 584219).');
      case 509:	return this.translate.instant( 'USED BY MANY SERVERS TO INDICATE A QUOTA OVERRUN.');
      case 510:	return this.translate.instant( 'THE REQUEST DOES NOT RESPECT THE HTTP EXTENDED RESOURCES ACCESS POLICY.');
      case 511:	return this.translate.instant( 'THE CLIENT MUST AUTHENTICATE TO ACCESS THE NETWORK. USED BY CAPTIVE PORTALS TO REDIRECT CUSTOMERS TO THE AUTHENTICATION PAGE.');

      // Project errors
      default: return this.translate.instant('AN ERROR HAS OCCURRED.');
    }
  }

  // get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
  //   let retries = this.MAX_RETRIES;
  //   return this.http.get(`${this.baseUrl}${path}`, { params })
  //     .pipe(
  //       retry(1),
  //       catchError(this.handleError)
  //       // retryWhen((errors: Observable<any>) =>
  //       //   errors.pipe(
  //       //     delay(this.DELAY_MS),
  //       //     mergeMap(error => retries-- > 0 && error.status === 429? of(error) :
  //       //       throwError(this.getGiveUpErrorMsg(this.MAX_RETRIES, error.status)))
  //       //   ))
  //     );
  // }

  get(path: string, params: HttpParams = new HttpParams(), download = false): Observable<any> {
    if (!download) {
      return this.http
        .get(`${this.baseUrl}${path}`, {params})
        .pipe(catchError(error => new ErrorObservable(error.error)));
    } else {
      return this.http
        .get(`${this.baseUrl}${path}`, {
          responseType: 'blob',
          params: params,
          observe: 'response'
        })
        .pipe(catchError(error => new ErrorObservable(error)));
    }
  }

  put(path: string, body = {}): Observable<any> {
    const retries = this.MAX_RETRIES;
    return this.http.put(`${this.baseUrl}${path}`, body)
      .pipe(
        retry(1),
        catchError(this.handleError)
        // retryWhen((errors: Observable<any>) =>
        //   errors.pipe(
        //     delay(this.DELAY_MS),
        //     mergeMap(error => retries-- > 0 && error.status === 429? of(error) : throwError(this.getGiveUpErrorMsg(this.MAX_RETRIES, error.status)))
        //   ))
      );
  }

  post(path: string, body: any, retries = this.MAX_RETRIES): Observable<any> {
    let delayms = this.DELAY_MS;
    const stopSignal$ = new Subject();
    return this.http.post(`${this.baseUrl}${path}`, body);
  }

  delete(path: string): Observable<any> {
    const retries = this.MAX_RETRIES;
    return this.http.delete( `${this.baseUrl}${path}`, {})
      .pipe(
        retry(1),
        catchError(this.handleError)
        // retryWhen((errors: Observable<any>) =>
        //   errors.pipe(
        //     delay(this.DELAY_MS),
        //     mergeMap(error => retries-- > 0 && error.status === 429? of(error) : throwError(this.getGiveUpErrorMsg(this.MAX_RETRIES, error.status)))
        //   ))
      );

  }
}
