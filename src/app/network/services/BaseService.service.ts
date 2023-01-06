import {Observable} from 'rxjs';

export interface BaseService{
  getOne(params): Observable<any>;
  getAll(params): Observable<any>;
  add(params): Observable<any>;
  update(params): Observable<any>;
  delete(params): Observable<any>;
}
