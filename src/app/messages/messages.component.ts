import { Component, Input } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    imports: [TranslatePipe]
})
export class MessagesComponent {
  @Input() message: '';
  @Input() subsystemId: '';
}
