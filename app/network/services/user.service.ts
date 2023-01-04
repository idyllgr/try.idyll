import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import 'rxjs/add/operator/map';
import {BaseService} from './BaseService.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import 'rxjs-compat/add/operator/catch';
import {DomSanitizer} from '@angular/platform-browser';
import {JwtStore} from '../../../shared/store/jwt.store';
import {UserStore} from '../../../shared/store/user.store';
import {MainStore} from '../../../shared/store/mainStore';
import {environment} from '../../../environments/environment';
import {NgxPermissionsService} from "ngx-permissions";
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";
import {ErrorsService} from "./errors.service";
import Swal from "sweetalert2";
import {toJS} from "mobx";

export enum $userRoles {
    SUPER = 'super',
    ADMIN = 'admin',
}

export enum $userRolesIds {
    SUPER = 1,
    ADMIN = 2,
}

@Injectable()
export class UserService implements BaseService {

  constructor(
    private apiService: ApiService,
    private jwtStore: JwtStore,
    private userStore: UserStore,
    private mainStore: MainStore,
    private errorsService: ErrorsService,
    private translate: TranslateService,
    private messageService: MessageService,
    private permissionsService: NgxPermissionsService,
    // private ngxRolesService: NgxRolesService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}


  sendPasswordResetLink(data) {
    return this.apiService.post(`sendPasswordResetLink`, data);
  }

  changePassword(data) {
    return this.apiService.post(`resetPassword`, data);
  }

  getResetEmail(params) {
    return this.apiService.post(`getResetEmail`, params);
  }

  askEmailValidation() {
    return this.apiService.get(`askEmailValidation`);
  }

  verifyUserEmail(token) {
    return this.apiService.get(`verify/${token}`);
  }

  async populate() {
    console.log('Populating');
    try {
      const res = await this.apiService
        .post('me', {})
        .toPromise();
       this.setAuth({
         token: this.jwtStore.getToken,
         user: res.user
       });
      return true;
    } catch (e) {
      console.log('populating failed', e);
      const err = {
          error : {
              message: e?.error?.error,
              status: e?.status
          }
      }
      if(e?.error?.error === 'Your email address is not verified.'){
          Swal.fire({
              title: this.translate.instant('EMAIL VERIFICATION'),
              text: this.translate.instant('LOOKS LIKE YOUR ACCOUNT IS NOT ACTIVATED YET!' +
                  ' CLICK SEND EMAIL AND CHECK YOUR EMAIL BOX TO COMPLETE YOUR REGISTRATION'),
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#59a6d4',
              cancelButtonColor: '#f3533b',
              confirmButtonText: this.translate.instant('YES, SEND ME EMAIL!'),
              cancelButtonText: this.translate.instant('CANCEL'),
              heightAuto: false
          }).then(async (result) => {
              if (result.value) {
                  try {
                      const res = await this.askEmailValidation().toPromise();
                      console.log('res', res);
                      if (res) {
                          Swal.fire(
                              {
                                  title: this.translate.instant('SUCCESSFUL OPERATION!'),
                                  text:  this.translate.instant('CHECK YOUR EMAIL BOX TO COMPLETE REGISTRATION'),
                                  icon: 'success',
                                  heightAuto: false
                              }
                          );
                      } else {
                          throw new Error();
                      }
                  } catch (error) {
                      const errorMessage = this.errorsService.getErrorMessage(error);
                      console.log('errorMessage', errorMessage);
                      Swal.fire(
                          {
                              title: this.translate.instant('FAILURE!'),
                              text: errorMessage,
                              icon: 'error',
                              heightAuto: false
                          }
                      );
                  }
              }
          });
      }else {
          this.purgeAuth();
          console.log('err', err);
          const errorMessage = this.errorsService.getErrorMessage(err);
          this.messageService.add({severity: 'error',
              summary: this.translate.instant('FAILURE!'),
              detail: errorMessage, sticky: true});
      }

        // this.purgeAuth();
      return false;
    }
  }

  setAuth({ user, token }: any) {

    console.log('setAuth haha', user, token);
    // const perm = ['ADMIN', 'USER'];

    this.permissionsService.loadPermissions([user.roles[0].name]);


    if(Array.isArray(user)) {
      user = user[0];
    }


    this.jwtStore.saveToken(token);
    this.userStore.setAuthenticatedUser(user);


      let timeleft = '';
      let severity = 'warn';
      if(this.mainStore.selectedBusiness?.time_left || this.mainStore.selectedBusiness?.blocked_for_payment){
          if(this.mainStore.selectedBusiness.number_of_unpaied_months){
              this.mainStore.sidebarItemsAdmin.find(item => item.name ==='MY PAYMENTS').notification =
                  this.mainStore.selectedBusiness.number_of_unpaied_months;
          }
          timeleft =  ' '+
              this.translate.instant('YOUR ACTIVITY MAY BE INTERRUPTED IN')
              +' '+
              this.mainStore.selectedBusiness.time_left
              +' '+
              this.translate.instant('DAYS');
          if(this.mainStore.selectedBusiness.time_left <= 5){
              severity = 'error';
          }
          this.userStore.setMessage(severity, timeleft, this.mainStore.selectedBusiness?.blocked_for_payment);
      }
  }

  purgeAuth() {
    console.log('purge auth');
    this.jwtStore.destroyToken();
    this.userStore.setAuthenticatedUser(null);
  }

  attemptAuth(credentials): any {
    // credentials.deviceuid = 'web';
    // credentials.platform = 'web';
    console.log('attemptAuth', credentials);

    return this.apiService.post('login', credentials);
  }

    register(credentials: any) {
        return this.apiService.post('register', credentials);//.map(res => {
            // this.setAuth(res);
            // return res;
        // });
    }

  loggout(){
    return this.apiService.post('logout', {});
  }

  add(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/users/add', params);
  }

  blockUser(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/disableUser', params);
  }

  unBlockUser(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/enableUser', params);
  }

  delete(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/users/delete', params);
  }

  getAll(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/users/all', params);
  }

  getOne(params): Observable<any> {
    return this.apiService.get(this.userStore.getAuthenticatedUser.roles[0].name+'/users/get', params);
  }

  update(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/users/edit', params);
  }

  updateProfile(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/editProfile', params);
  }

  getRoles(): Observable<any> {
    return this.apiService.get(this.userStore.getAuthenticatedUser.roles[0].name+'/roles/all');
  }

  getPhoto(photoname: String): Observable<any>{
    return this.http.get(environment.photosBaseUrl + photoname, {responseType: 'blob'})
      .catch((error: HttpErrorResponse) => Observable.throw(error));
  }

    async getImageSafeUrl(link, prefix_1, safeUrl = true) {

        const pattern = /^((http|https|ftp):\/\/)/;
        // console.log('link', link, pattern.test(link));
        if (prefix_1 && prefix_1.length>0 && !pattern.test(link)) {
            link = prefix_1+'/'+link;
            // if(!image){
        }

        console.log('hello getImageSafeUrl', link, toJS(this.mainStore.images));
        const image = this.mainStore.images.find(item => item.name === link);

        try {
            let res ;
            if( !image) {
                // console.log('get Photo', link);
                if(pattern.test(link)) {
                    const blob = await this.http.get(link).toPromise();
                    // console.log('blob', blob);
                    // const response = await fetch(link);
                    // const blob = await response.json();
                    this.mainStore.images.push({name: link, value: blob});
                }else{
                    res = await this.getPhoto(link).toPromise();
                }
            } else{
                res = image.value;
            }
            this.mainStore.images.push({name: link, value: res});
            const imageLink = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(res));
            const imageUrl = window.URL.createObjectURL(res);
            this.downloadImage(link);
            return !safeUrl ? imageUrl : imageLink;
        } catch (error) {
            console.log(error);
            return 'assets/images/img_placeholder.png';
        }
    }

    downloadImage(imgUrl) {
        this.http.get(imgUrl, {responseType: 'blob' as 'json'})
            .subscribe((res: any) => {
                const file = new Blob([res], {type: res.type});
                const blob = window.URL.createObjectURL(file);
                console.log('blob ', imgUrl, blob );

            });
    }

    sendRating(params) {
        return this.apiService.post('sendRating', params);
    }
}
