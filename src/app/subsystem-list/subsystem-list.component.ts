import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subsystem } from '../subsystem';
import { MethodsService } from '../methods.service';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-subsystem-list',
  templateUrl: './subsystem-list.component.html',
  styleUrls: ['./subsystem-list.component.css']
})
export class SubsystemListComponent implements OnInit, OnDestroy {
  subsystems: Subsystem[]
  message: string = ''
  scrollPosition: [number, number]
  routerScrollSubscription: Subscription
  routeSubscription: Subscription
  updatedSubscription: Subscription
  warningsSubscription: Subscription

  constructor(
    private methodsService: MethodsService,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    // Geting previous scroll position
    this.routerScrollSubscription = this.router.events.pipe(
      filter(e => e instanceof Scroll)
    ).subscribe(e => {
      if ((e as Scroll).position) {
        this.scrollPosition = (e as Scroll).position;
      } else {
        this.scrollPosition = [0, 0];
      }
    });
  }

  ngOnInit() {
    // Reset message on page load
    this.message = ''

    // Service will tell when data loading failed!
    this.warningsSubscription = this.methodsService.warnings.subscribe(signal => {
      this.message = signal
    });
    
    this.routeSubscription = this.route.params.subscribe( params => {
      // Reset message on navigation
      this.message = ''

      // Redirect to default instance if instance is empty or invalid
      if (!this.methodsService.getInstances().includes(params['instance'])) {
        this.router.navigateByUrl('/' + this.methodsService.getDefaultInstance())
        return
      }
      // Only reload on switching of instance or when no instance is selected yet on service side
      if (this.getInstance() == '' || this.getInstance() != params['instance']) {
        this.methodsService.setInstance(params['instance'] ? params['instance'] : this.methodsService.getDefaultInstance())
      }
    });

    // Service will tell when updated data is available!
    this.updatedSubscription = this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.getMethods();
    });
    // If json data is loaded update event will not be emited.
    // This line must be after subscription (data may be changed while we start subscription)
    this.getMethods();
  }

  ngAfterViewInit() {
    // Restoring scroll position
    this.viewportScroller.scrollToPosition(this.scrollPosition);
  }

  ngOnDestroy() {
    this.routerScrollSubscription.unsubscribe()
    this.routeSubscription.unsubscribe()
    this.updatedSubscription.unsubscribe()
    this.warningsSubscription.unsubscribe()
  }

  getInstance(): string {
    return this.methodsService.getInstance()
  }

  getInstances(): string[] {
    return this.methodsService.getInstances()
  }

  getMethods(): void {
    this.subsystems = this.methodsService.getMethods()
  }

  switchInstance(instance: string): void {
    this.router.navigateByUrl('/' + instance)
  }
}
