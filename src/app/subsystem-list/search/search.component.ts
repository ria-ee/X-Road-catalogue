import { Component, OnInit } from '@angular/core';
import { SubsystemsService } from '../../subsystems.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    imports: [FormsModule, NgFor, TranslatePipe]
})
export class SearchComponent implements OnInit {
  limit: string;
  limits: Record<string, number>;
  nonEmpty: boolean;
  filter: string;

  constructor(private subsystemsService: SubsystemsService) {
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
