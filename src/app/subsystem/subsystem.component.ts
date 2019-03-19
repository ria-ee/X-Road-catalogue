import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubsystemsService } from '../subsystems.service';
import { Subsystem } from '../subsystem';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-subsystem',
  templateUrl: './subsystem.component.html'
})
export class SubsystemComponent implements OnInit, AfterViewInit, OnDestroy {
  subsystemId = '';
  message = '';
  private scrollSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private routerScrollSubscription: Subscription;
  private routeSubscription: Subscription;
  private warningsSubscription: Subscription;
  private scrollSubjectSubscription: Subscription;
  private subsystemsSubscription: Subscription;
  subsystemSubject: BehaviorSubject<Subsystem> = new BehaviorSubject(null);

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

  private getSubsystem(subsystems: Subsystem[], name: string): Subsystem {
    return subsystems.find((element) => {
      return element.fullSubsystemName === name;
    });
  }

  getInstance(): string {
    return this.subsystemsService.getInstance();
  }

  getApiUrlBase(): string {
    return this.subsystemsService.getApiUrlBase();
  }

  goToList(): void {
    this.router.navigateByUrl('/' + this.subsystemsService.getInstance());
  }

  ngOnInit() {
    // Reset message on page load
    this.message = '';

    // Service will tell when data loading failed!
    this.warningsSubscription = this.subsystemsService.warnings.subscribe(signal => {
      this.message = signal;
    });

    this.routeSubscription = this.route.params.subscribe( params => {
      // Checking if instance is correct
      if (!this.subsystemsService.getInstances().includes(params.instance)) {
        this.message = 'Incorrect instance!';
        return;
      }
      this.subsystemId = params.instance + '/' + params.class + '/' + params.member + '/' + params.subsystem;
      // Only reload on switching of instance or when no instance is selected yet on service side
      if (this.getInstance() === '' || this.getInstance() !== params.instance) {
        this.subsystemsService.setInstance(params.instance ? params.instance : this.subsystemsService.getDefaultInstance());
      }
      this.subsystemsSubscription = this.subsystemsService.subsystemsSubject.subscribe(subsystems => {
        const subsystem = this.getSubsystem(subsystems, this.subsystemId);
        if (!subsystem && !this.message) {
          this.message = 'Subsystem "' + this.subsystemId + '" cannot be found!';
        } else {
          this.subsystemSubject.next(subsystem);
        }
      });
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
    this.subsystemsSubscription.unsubscribe();
  }
}
