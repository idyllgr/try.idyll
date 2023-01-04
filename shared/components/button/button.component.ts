import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() text = '';
  @Input() type: MyButtonTypes = MyButtonTypes.primary;
  @Input() customStyle;
  @Input() isLoading = false;
  @Input() textLoading = 'Chargement';
  @Input() isDisabled = false;
  @Input() iconRight = '';
  @Input() iconLeft = '';
  @Output() onClick = new EventEmitter();

  myButtonTypes = MyButtonTypes;


  constructor() { }

  ngOnInit(): void {
  }

  onbtnclick(){
    if(!this.isDisabled){
      console.log('emit yes');
      this.onClick.emit();
    }
  }
}

export enum MyButtonTypes {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  danger = 'danger',

  icon = 'icon'
}
