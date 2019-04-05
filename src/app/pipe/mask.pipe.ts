import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  transform(value: any, type?: any, pass?: any): any {

    if (value == null) {
      return value;
    }

    if (pass) {
      value = replaceRange(value, 5, 8, '***');
    }
    switch (type) {
      case 'phone':
        value = value.replace(/^([0-9*]{2})\-?([0-9*]{3})\-?([0-9*]{3})([0-9*]{2})?([0-9*]{2})?$/i, '$1 ($2) $3 $4 $5');
        break;
    }
    return value;
  }

}

function replaceRange(s, start, end, substitute) {
  return s.substring(0, start) + substitute + s.substring(end);
}
