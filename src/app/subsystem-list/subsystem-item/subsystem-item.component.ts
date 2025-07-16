import { Component, Input, inject } from '@angular/core';
import { Subsystem } from '../../subsystem';
import { Method } from '../../method';
import { Service } from '../../service';
import { SubsystemsService } from '../../subsystems.service';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-subsystem-item',
    templateUrl: './subsystem-item.component.html',
    styleUrls: ['./subsystem-item.component.css'],
    imports: [TranslatePipe]
})
export class SubsystemItemComponent {
  private subsystemsService = inject(SubsystemsService);
  private router = inject(Router);
  private config = inject(AppConfig);

  @Input() subsystem: Subsystem;

  getApiUrlBase(): string {
    return this.subsystemsService.getApiUrlBase();
  }

  getMethodsPreview(): Method[] {
    return this.subsystem.methods.length ? this.subsystem.methods.slice(0, this.config.getConfig('PREVIEW_SIZE')) : [];
  }

  getServicesPreview(): Service[] {
    return this.subsystem.services.length ? this.subsystem.services.slice(0, this.config.getConfig('PREVIEW_SIZE')) : [];
  }

  getMethodsNotInPreview(): number {
    if (this.subsystem.methods.length - this.config.getConfig('PREVIEW_SIZE') < 0) {
      return 0;
    }
    return this.subsystem.methods.length - this.config.getConfig('PREVIEW_SIZE');
  }

  getServicesNotInPreview(): number {
    if (this.subsystem.services.length - this.config.getConfig('PREVIEW_SIZE') < 0) {
      return 0;
    }
    return this.subsystem.services.length - this.config.getConfig('PREVIEW_SIZE');
  }

  showDetail() {
    this.router.navigateByUrl(
      '/' + this.subsystem.xRoadInstance
      + '/' + this.subsystem.memberClass
      + '/' + this.subsystem.memberCode
      + '/' + this.subsystem.subsystemCode
      + (this.subsystemsService.getInstanceVersion() ? '?at=' + this.subsystemsService.getInstanceVersion() : '')
    );
  }
}
