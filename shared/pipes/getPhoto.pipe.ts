import { Pipe, PipeTransform } from '@angular/core';
import {UserService} from '../../app/network/services';

@Pipe({ name: 'getPhotoFromBackend' })
export class GetPhotoPipe implements PipeTransform {

  constructor(private userService: UserService) { }

    async transform(photo, prefix_1?) {
        const regexp_upload = /^data:?[a-z]{5}\/[a-z]*;.*/;
        const patternLink = /^((http|https|ftp):\/\/)/;
        if (regexp_upload.test(photo)) {
            return photo;
        }
        if(patternLink.test(photo)) {
            return photo;
        }
        if(prefix_1?.indexOf('assets/images') !== -1) {
            return prefix_1 + photo;
        }
        return await this.userService.getImageSafeUrl(photo, prefix_1);
    }
}
