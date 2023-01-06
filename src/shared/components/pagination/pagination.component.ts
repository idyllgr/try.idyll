import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PaginationComponent),
  multi: true
};
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class PaginationComponent implements ControlValueAccessor {
  @Output() change = new EventEmitter();
  pagination = {
    page: 1,
    pageSize: 10,
    total: 10
  };
  disabled = false;
  constructor() {}

  onChange = any => {console.log(any);};
  onTouched = () => {};
  registerOnChange(fn: (data_obj: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  get value(): any {
    return this.pagination;
  }
  writeValue(data: any): void {
    if (data) {
      this.pagination = data;
    }
  }
  updatePageSize(pageSize) {
    this.pagination = {
      ...this.pagination,
      page: 1,
      pageSize: parseInt(pageSize, 10)
    };
    this.onChange(this.pagination);
    this.change.emit(this.pagination);
  }
  next() {
    if (
      this.pagination.page <
      Math.ceil(this.pagination.total / this.pagination.pageSize)
    ) {
      this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
      this.onChange(this.pagination);
      this.change.emit(this.pagination);
    }
  }
  previous() {
    if (this.pagination.page > 1) {
      this.pagination = { ...this.pagination, page: this.pagination.page - 1 };
      this.onChange(this.pagination);
      this.change.emit(this.pagination);
    }
  }
  isFirstPage() {
    return this.pagination.page === 1;
  }
  isLastPage() {
    return (
      this.pagination.page ===
      Math.ceil(this.pagination.total / this.pagination.pageSize)
    );
  }
}
