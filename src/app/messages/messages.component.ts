import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit {
  @Input() message: '';
  @Input() subsystemId: '';

  constructor() { }

  ngOnInit() {
  }

}
