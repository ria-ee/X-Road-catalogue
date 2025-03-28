import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    imports: [NgIf, TranslatePipe]
})
export class MessagesComponent {
  @Input() message: '';
  @Input() subsystemId: '';
}
