import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { SubsystemsService } from '../../subsystems.service';
import { FormsModule } from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslatePipe]
})
export class SearchComponent implements OnInit {
  private subsystemsService = inject(SubsystemsService);

  limit: string;
  limits: Record<string, number>;
  nonEmpty = false;
  filter = '';

  constructor() {
    this.limit = this.subsystemsService.getLimit();
    this.limits = this.subsystemsService.getLimits();
  }

  getLimitKeys(): string[] {
    return Object.keys(this.limits);
  }

  setNonEmpty(nonEmpty: boolean) {
    this.subsystemsService.setNonEmpty(nonEmpty);
  }

  setLimit(limit: string) {
    this.limit = limit;
    this.subsystemsService.setLimit(limit);
  }

  setFilter(filter: string) {
    this.subsystemsService.setFilter(filter);
  }

  ngOnInit() {
    this.limit = this.subsystemsService.getLimit();
    this.nonEmpty = this.subsystemsService.getNonEmpty();
    this.filter = this.subsystemsService.getfilter();
  }
}
