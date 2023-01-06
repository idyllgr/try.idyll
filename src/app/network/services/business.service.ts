import {Injectable} from '@angular/core';
import { ApiService } from './api.service';
import 'rxjs/add/operator/map';
import {BaseService} from './BaseService.service';
import {Observable} from 'rxjs';
import 'rxjs-compat/add/operator/catch';
import {UserStore} from '../../../shared/store/user.store';
import {JwtStore} from '../../../shared/store/jwt.store';
import {MainStore} from "../../../shared/store/mainStore";

@Injectable()
export class BusinessService implements BaseService {

  constructor(
    private apiService: ApiService,
    private jwtStore: JwtStore,
    private userStore: UserStore,
    private mainStore: MainStore,
  ) {}

  add(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/businesses/add', params);
  }

  delete(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/businesses/delete', params);
  }

  getAll(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/businesses/all', params);
  }

  getOne(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/businesses/get', params);
  }

  getOneAsGuest(params): Observable<any> {
    return this.apiService.post(  'businesses/getOneAsGuest', params);
  }

  update(params): Observable<any> {
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/businesses/edit', params);
  }

    submitStat(params) {
        params = this.appendBusinessId(params);
        return this.apiService.post(  'businesses/submitStat', params);
    }

    createOrder(params) {
        params = this.appendBusinessId(params);
        return this.apiService.post(  'businesses/createOrder', params);
    }

    private appendBusinessId(params){
        if(params instanceof FormData){
            params.append('business_id', this.mainStore.selectedBusiness?.id);
        }else{
            params = {...params, business_id: this.mainStore.selectedBusiness?.id};
        }
        return params;
    }

}
