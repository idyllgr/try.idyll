import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, ValidationErrors} from '@angular/forms';


export class SharedClasses {

    static ismobileAndTabletCheck() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

  static getModalDissmissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
    static emailValidator(control) {
        if (control.value) {
            const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
            console.log('matches', matches);
            return matches ? null : { 'email': true };
        } else {
            return null;
        }
    }

    static isControlRequired(control: AbstractControl): boolean {
        if (!control) {
            return false;
        }

        if (control.validator) {
            const validator = control.validator({} as AbstractControl);
            if (validator && validator.required) {
                return true;
            }
        }

        return false;
    }

    static decodeBase64(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
    }

    static from64ToImageFile(img64){
        const decodedImage = SharedClasses.decodeBase64(img64);
        const blob = new Blob([decodedImage], {type: 'image/png'});
        const file = new File([blob], 'decotok.png', { type: 'image/png' });
        console.log('filesize', file);
        return file;
    }
}


export function getFormValidationErrors(form) {
  Object.keys(form.controls).forEach(key => {

    const controlErrors: ValidationErrors = form.get(key).errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError],
            'current value', form.controls[key].value);
      });
    }
  });
}
