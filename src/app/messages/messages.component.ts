import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslatePipe]
})
export class MessagesComponent {
  @Input() message = '';
  @Input() subsystemId = '';
}
