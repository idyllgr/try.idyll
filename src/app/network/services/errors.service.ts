import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ErrorsService {
  baseUrl: string;
  constructor(private translate: TranslateService) {}

  getErrorMessage(err): string {
    let msg = '';
    const error = err.error;
    console.log('getErrorMessage', error);

    if(error && error.message){
      msg += error.message;
    }else{
        msg += this.getMessage(error?.status);
    }
    console.log('msg', msg);
    return msg || 'Un erreur est survenue';
  }


  getMessage(code): string{
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
}
