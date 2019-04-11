import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subsystem } from '../subsystem';
import { SubsystemsService } from '../subsystems.service';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-subsystem-list',
  templateUrl: './subsystem-list.component.html'
})
export class SubsystemListComponent implements OnInit, AfterViewInit, OnDestroy {
  message = '';
  scrollSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  routerScrollSubscription: Subscription;
  routeSubscription: Subscription;
  warningsSubscription: Subscription;
  scrollSubjectSubscription: Subscription;
  filteredSubsystems: BehaviorSubject<Subsystem[]>;

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

  ngOnInit() {
    // Reset message on page load
    this.message = '';
    this.filteredSubsystems = this.subsystemsService.filteredSubsystemsSubject;

    // Service will tell when data loading failed!
    this.warningsSubscription = this.subsystemsService.warnings.subscribe(signal => {
      this.message = signal;
    });

    this.routeSubscription = this.route.params.subscribe( params => {
      // Reset message on navigation
      this.message = '';

      // Redirect to default instance if instance is empty or invalid
      if (!this.subsystemsService.getInstances().includes(params.instance)) {
        this.router.navigateByUrl('/' + this.subsystemsService.getDefaultInstance());
        return;
      }
      // Only reload on switching of instance or when no instance is selected yet on service side
      if (this.getInstance() === '' || this.getInstance() !== params.instance) {
        this.subsystemsService.setInstance(params.instance);
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
