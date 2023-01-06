import 'rxjs/add/operator/do';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {ErrorsService} from "../services";
import {MessageService} from "primeng/api";
// import {MessageService} from 'primeng/api';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private messageService: MessageService,
    private errorsService: ErrorsService
              ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
          console.log('response success', event);
      }
    }, (error: any) => {
      console.log('err JwtInterceptor', error)
      if (error instanceof HttpErrorResponse) {
        console.log('intercept haha', error);
          const errorMessage = this.errorsService.getErrorMessage(error);
        if(errorMessage !== 'Une erreur est survenue') {
          this.messageService.add({severity: 'error', summary: 'Error ' + error.error.status, detail: errorMessage, sticky: false, closable: true});
        }
        if (error.error.status === 401) {
          // redirect to the login route
          // or show a moda l
          this.router.navigate(['/auth/login']);
        }
        if (error.error.status === 403) {
          // redirect to the login route
          // or show a moda l
            console.log('haha', error);
        }
      }
    });
  }
}
