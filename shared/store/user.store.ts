import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
import {observable, action, computed} from 'mobx-angular';
import {MainStore} from "./mainStore";
import {TranslateService} from "@ngx-translate/core";


@Injectable()
export class UserStore {

  @observable authenticatedUser;

  constructor(
        private mainStore :MainStore,
        private translate: TranslateService,
  ) {}


  @computed
  get getAuthenticatedUser() {
    return this.authenticatedUser;
  }

  @action
  setAuthenticatedUser(user) {
    // try {
      console.log('setAuthenticatedUser', user);
      this.authenticatedUser = user;
      if(user && user.businesses && user.businesses.length>0){
          this.mainStore.selectedBusiness = user?.businesses[0];
      }
    // }catch (e) {
    //   console.log(e);
    // }
  }


    @action
    setMessage(severity, timeleft, blocked_for_payment=false){
        if(blocked_for_payment){
            this.mainStore.msgsNotificationPayment = [
                {
                    severity: 'error',
                    summary: this.translate.instant('HELLO')+ ' '+ this.getAuthenticatedUser.name+'! ',
                    sticky: true,
                    detail:
                        this.translate.instant('LOOKS LIKE YOU HAVE AN UNPAID MONTH, YOUR ACTIVITY HAS BEEN SUSPENDED')
                        + "&nbsp;&nbsp;<a href='/admin/payments'>" + this.translate.instant('VISITE PAYMENT PAGE') + "</a>"
                        +' '+
                        this.translate.instant('TO UNBLOCK YOUR BUSINESS ACCOUNT')
                },
            ];
        }else{
            if(timeleft){
                this.mainStore.msgsNotificationPayment = [
                    {
                        severity: severity,
                        summary: this.translate.instant('HELLO')+ ' '+ this.getAuthenticatedUser.name+'! ',
                        sticky: true,
                        detail:
                            this.translate.instant('LOOKS LIKE YOU HAVE AN UNPAID MONTH, PLEASE GO TO THE PAYMENT PAGE TO COMPLETE YOUR PAYMENT')
                            + "&nbsp;&nbsp;<a target='_blank' href='/admin/payments'>" + this.translate.instant('VISITE PAYMENT PAGE') + "</a>"
                            + timeleft

                    },
                ];
            }else {
                this.mainStore.msgsNotificationPayment = null;
            }
        }
    }

}
