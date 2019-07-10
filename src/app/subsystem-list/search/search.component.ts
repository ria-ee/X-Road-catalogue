import { Component, OnInit } from '@angular/core';
import { SubsystemsService } from '../../subsystems.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  limit: string;
  limits: object;
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
