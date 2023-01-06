import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paginate' })
export class PaginatePipe implements PipeTransform {
  constructor() {}
  transform(items: any[], pagination: any) {
    const elems = [];
    const start = (pagination.page - 1) * pagination.pageSize;
    const end =
      pagination.page * pagination.pageSize < pagination.total
        ? pagination.page * pagination.pageSize
        : pagination.total;

    for (let i = start; i < end; i++) {
      elems.push(items[i]);
    }
    return elems;
  }
}
