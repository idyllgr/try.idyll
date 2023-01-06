import {Injectable} from '@angular/core';
import { ApiService } from './api.service';
import {Observable} from 'rxjs';
import {UserStore} from "../../../shared/store/user.store";
import {MainStore} from "../../../shared/store/mainStore";

@Injectable()
export class ListsService {

  public list = {
    roles: 'roles',
    users: 'users',
    products: 'products',
    categories: 'categories',
    orders: 'orders',
    locations: 'locations',
      businesses: 'businesses',
    backgrounds: 'backgrounds',
      transactions: 'transactions',
  };


  constructor(
    private apiService: ApiService,
    private userStore: UserStore,
    private mainStore: MainStore
  ) {}

  getAll(entity, params): Observable<any> {
      params = this.appendBusinessId(params);
    return this.apiService.post(this.userStore.getAuthenticatedUser.roles[0].name+'/' + entity + '/all', params);
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
