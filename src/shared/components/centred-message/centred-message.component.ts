import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-centred-message',
  templateUrl: './centred-message.component.html',
  styleUrls: ['./centred-message.component.scss']
})
export class CentredMessageComponent implements OnInit {

  @Input() title = '';
  @Input() message = '';
  @Input() image = '';

  constructor() { }

  ngOnInit() {
  }

}
