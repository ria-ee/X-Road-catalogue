import { Component, OnInit, inject } from '@angular/core';
import { SubsystemsService } from '../../subsystems.service';
import { FormsModule } from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    imports: [FormsModule, TranslatePipe]
})
export class SearchComponent implements OnInit {
  private subsystemsService = inject(SubsystemsService);

  limit: string;
  limits: Record<string, number>;
  nonEmpty: boolean;
  filter: string;
  memberClass = "all";
  memberClasses: string[] = [];
  memberCode = "all";
  memberCodes: string[] = [];

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

  setMemberClass(memberClass: string) {
    this.memberClass = memberClass;
    this.subsystemsService.setMemberClass(memberClass);

    // Reset member code to "all" and reload member codes
    this.memberCode = "all";
    this.subsystemsService.setMemberCode("all");
    this.loadMemberCodes();
  }

  private loadMemberClasses() {
    this.subsystemsService.getMemberClasses().subscribe((classes) => {
      this.memberClasses = classes;
    });
  }

  setMemberCode(memberCode: string) {
    this.memberCode = memberCode;
    this.subsystemsService.setMemberCode(memberCode);
  }

  private loadMemberCodes() {
    this.subsystemsService.getMemberCodes().subscribe((codes) => {
      this.memberCodes = codes;
    });
  }
  ngOnInit() {
    this.limit = this.subsystemsService.getLimit();
    this.nonEmpty = this.subsystemsService.getNonEmpty();
    this.filter = this.subsystemsService.getfilter();
    this.memberClass = this.subsystemsService.getMemberClass() || "all";
    this.loadMemberClasses();
    this.memberCode = this.subsystemsService.getMemberCode() || "all";
    this.loadMemberCodes();
  }
}
