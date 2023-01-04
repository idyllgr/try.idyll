import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  constructor() {}

  transform(items: [any], filter: string, attr: string) {
    let elems = [];
    if (filter && filter.length) {
      for (let i = 0; i < items.length; i++) {
        const name = items[i][attr] || '';
        if (
          name.toLowerCase().indexOf(filter.toLocaleLowerCase()) > -1
        ) {
          elems.push(items[i]);
        }
      }
    } else {
      elems = items;
    }
    return elems;
  }
}
