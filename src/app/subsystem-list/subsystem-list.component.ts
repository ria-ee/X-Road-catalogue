import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subsystem } from '../subsystem';
import { SubsystemsService } from '../subsystems.service';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ViewportScroller, NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { InstanceVersion } from '../instance-version';
import { SearchComponent } from './search/search.component';
import { HeaderComponent } from '../header/header.component';
import { MessagesComponent } from '../messages/messages.component';
import { FormsModule } from '@angular/forms';
import { SubsystemItemComponent } from './subsystem-item/subsystem-item.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-subsystem-list',
    templateUrl: './subsystem-list.component.html',
    imports: [HeaderComponent, NgIf, MessagesComponent, NgFor, NgClass, FormsModule, SearchComponent, SubsystemItemComponent, AsyncPipe, TranslatePipe]
})
export class SubsystemListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(SearchComponent, { static: true }) search;

  message: string;
  scrollSubject = new BehaviorSubject<[number, number]>(null);
  routerScrollSubscription: Subscription;
  routeSubscription: Subscription;
  warningsSubscription: Subscription;
  scrollSubjectSubscription: Subscription;
  filteredSubsystems: BehaviorSubject<Subsystem[]>;
  instanceVersions: BehaviorSubject<InstanceVersion[]>;
  instanceVersion: string;

  constructor(
    private subsystemsService: SubsystemsService,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    // Geting previous scroll position
    this.routerScrollSubscription = this.router.events.pipe(
      filter(e => e instanceof Scroll)
    ).subscribe(async (e) => {
      if ((e as Scroll).position) {
        this.scrollSubject.next((e as Scroll).position);
      }
    });
  }

  getInstance(): string {
    return this.subsystemsService.getInstance();
  }

  getInstances(): string[] {
    return this.subsystemsService.getInstances();
  }

  switchInstance(instance: string): void {
    this.router.navigateByUrl('/' + instance);
    // Reloading data if clicked on the current instance
    if (this.subsystemsService.getInstance() === instance) {
      this.instanceVersion = '';
      this.subsystemsService.setInstance(instance, this.instanceVersion);
    }
  }

  getApiUrl(): string {
    return this.subsystemsService.getApiUrl();
  }

  isPartialList(): boolean {
    const limit = parseInt(this.subsystemsService.getLimit(), 10);
    if (isNaN(limit)) {
      // limit is "all" (or some faulty string)
      return false;
    } else if (this.filteredSubsystems.value.length < limit) {
      return false;
    } else {
      // If subsystems length == limit then we still asume it is partial
      return true;
    }
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  setInstanceVersion() {
    // This will update URL without triggering route.params
    this.router.navigateByUrl(
      '/' + this.subsystemsService.getInstance()
      + (this.instanceVersion ? '?at=' + this.instanceVersion : ''));
    this.subsystemsService.setInstance(this.subsystemsService.getInstance(), this.instanceVersion);
  }

  setMaxLimit() {
    this.search.setLimit('all');
  }

  isIE() {
    const ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    // Reset message on page load
    this.message = '';

    this.filteredSubsystems = this.subsystemsService.filteredSubsystemsSubject;
    this.instanceVersions = this.subsystemsService.instanceVersionsSubject;

    // Service will tell when data loading failed!
    this.warningsSubscription = this.subsystemsService.warnings.subscribe(signal => {
      this.message = signal;
    });

    this.routeSubscription = this.route.params.subscribe( params => {
      // Reset message on navigation
      this.message = '';

      // Redirect to default instance if instance is empty or invalid
      if (this.subsystemsService.getInstances().indexOf(params.instance) < 0) {
        this.router.navigateByUrl('/' + this.subsystemsService.getDefaultInstance(), { replaceUrl: true });
        return;
      }

      // Set selected instance version
      if (this.route.snapshot && this.route.snapshot.queryParams.at) {
        this.instanceVersion = this.route.snapshot.queryParams.at;
      } else {
        this.instanceVersion = '';
      }

      // Only reload on switching of instance or when no instance is selected yet on service side
      if (this.getInstance() === '' || this.getInstance() !== params.instance) {
        this.subsystemsService.setInstance(params.instance, this.instanceVersion);
      }
    });
  }

  ngAfterViewInit() {
    // Restoring scroll position
    this.scrollSubjectSubscription = this.scrollSubject.subscribe( position => {
      if (position) {
        this.viewportScroller.scrollToPosition(position);
      }
    });
  }

  ngOnDestroy() {
    this.routerScrollSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.warningsSubscription.unsubscribe();
    this.scrollSubjectSubscription.unsubscribe();
  }
}
