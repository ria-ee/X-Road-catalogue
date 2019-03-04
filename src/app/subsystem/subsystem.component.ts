import { Component, OnInit, OnDestroy } from '@angular/core';
import { MethodsService } from '../methods.service';
import { Subsystem } from '../subsystem';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subsystem',
  templateUrl: './subsystem.component.html',
  styleUrls: ['./subsystem.component.css']
})
export class SubsystemComponent implements OnInit, OnDestroy {
  subsystem: Subsystem
  subsystemId: string
  message: string = ''
  routeSubscription: Subscription
  updatedSubscription: Subscription
  warningsSubscription: Subscription

  constructor(
    private methodsService: MethodsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  private checkSubsystem() {
    // Do not overwrite previous warnings
    if (!this.subsystem && !this.message) {
      this.message = 'Subsystem "' + this.subsystemId + '" cannot be found!'
    } 
} 

  ngOnInit() {
    // Reset message on page load
    this.message = ''

    // Service will tell when data loading failed!
    this.warningsSubscription = this.methodsService.warnings.subscribe(signal => {
      this.message = signal
    });

    this.routeSubscription = this.route.params.subscribe( params => {
      // Checking if instance is correct
      if (!this.methodsService.getInstances().includes(params['instance'])) {
        this.message = 'Incorrect instance!'
        return
      }
      this.subsystemId = params['instance'] + '/' + params['class'] + '/' + params['member'] + '/' + params['subsystem']
      // Only reload on switching of instance or when no instance is selected yet on service side
      if (this.getInstance() == '' || this.getInstance() != params['instance']) {
        this.methodsService.setInstance(params['instance'] ? params['instance'] : this.methodsService.getDefaultInstance())
      }
    });

    // Service will tell when data has finished loading
    this.updatedSubscription = this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
      if (this.methodsService.isLoadingDone() && !this.methodsService.isLoadingError()) {
        this.checkSubsystem()
      }
    });
    // If json data is loaded update event will not be emited.
    // This line must be after subscription (data may be changed while we start subscription)
    if (this.subsystemId && this.methodsService.isLoadingDone() && !this.methodsService.isLoadingError()) {
      this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
      this.checkSubsystem()
    }
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe()
    this.updatedSubscription.unsubscribe()
    this.warningsSubscription.unsubscribe()
  }

  getInstance(): string {
    return this.methodsService.getInstance()
  }

  getApiUrlBase(): string {
    return this.methodsService.getApiUrlBase()
  }

  goToList(): void {
    this.router.navigateByUrl('/' + this.methodsService.getInstance())
  }
}