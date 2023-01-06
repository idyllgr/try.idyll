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
export class ProductService implements BaseService {

  constructor(
    private apiService: ApiService,
    private jwtStore: JwtStore,
    private userStore: UserStore,
    private mainStore: MainStore
  ) {}

  add(params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/products/add', params);
  }

  delete(params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/products/delete', params);
  }

  getAll(params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/products/all', params);
  }

  getOne(params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/products/get', params);
  }

  update(params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/products/edit', params);
  }

  updateCategory(params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/categories/edit', params);
  }

    addCategory(params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/categories/add', params);
  }

    deleteCategory(params) {
        params = this.appendBusinessId(params);
        return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name + '/categories/delete', params);
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
