import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'momentPipe'
})
export class MomentPipe implements PipeTransform {

  transform(value: Date|moment.Moment, ...args: any[]): any {
    const [format] = args;
    const formats = ['DD-MM-YYYY h:mm:ss', 'YYYY-MM-DD h:mm:ss'];
    return moment(value, formats).locale('fr').format(format);
  }
}
