import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'dateMessage'
})
export class DateMessagePipe implements PipeTransform {
  transform(timestamp: any, args?: any): string {
    const FR = 'DD MMM YYYY';
    const EN = 'MMM DD ,YYYY';
    let format = FR;

    moment.locale('fr');

    const localLang: string = localStorage.getItem('lang');
    if(localLang === 'en'){
      format = EN;
    }
    if (localLang) {
      moment.locale(localLang);
    }

    if(args){
      format = args;
    }
    return (timestamp) ? moment(timestamp).format(format) : '';
  }
}
