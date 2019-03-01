import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { Subsystem } from '../subsystem';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subsystem',
  templateUrl: './subsystem.component.html',
  styleUrls: ['./subsystem.component.css']
})
export class SubsystemComponent implements OnInit {
  subsystem: Subsystem
  subsystemId: string
  message: string = ''

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
    this.methodsService.warnings.subscribe(signal => {
      this.message = signal
    });

    this.route.params.subscribe( params => {
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
    this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
      if (this.methodsService.isLoadingDone() && !this.methodsService.isLoadingError()) {
        this.checkSubsystem()
      }
      // TODO: No need to recheck after loading is done
    });
    // If json data is loaded update event will not be emited.
    // This line must be after subscription (data may be changed while we start subscription)
    if (this.subsystemId && this.methodsService.isLoadingDone() && !this.methodsService.isLoadingError()) {
      this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
      this.checkSubsystem()
    }
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
