import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'ago' })
export class AgoPipe implements PipeTransform {
  constructor() {}
  transform(date) {
    moment.locale('fr');
    return date ? moment(date, ['DD-MM-YYYY h:mm:ss', 'YYYY-MM-DD h:mm:ss']).fromNow() : '';
  }
}
