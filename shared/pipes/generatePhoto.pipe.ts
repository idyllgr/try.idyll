import { Pipe, PipeTransform } from '@angular/core';
// import { config } from '../../../../config';
// import {environment} from '../../../environments/environment';

@Pipe({ name: 'generatePhoto' })
export class GeneratePhotoPipe implements PipeTransform {
  constructor() { }
  transform(photo, type, defaultPhoto?) {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const regexp_upload = /^data:?[a-z]{5}\/[a-z]*;.*/;
    let res = 'assets/images/anonyme.png';

    if (regexp.test(photo) || regexp_upload.test(photo)) {
      res = photo;
    } else {
      if (photo === '/photos/placeholder.jpg/0/0/0') {
        res = 'assets/images/anonyme.png';
      } else {
        res = photo
          ?  '' + photo + '/0/0/0'
          : defaultPhoto;
      }
    }

    if (type === 'background') {
      res = `url(${res})`;
    }
    return res;
  }
}
