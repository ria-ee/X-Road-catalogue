import { Component, OnInit } from '@angular/core';
import { Subsystem } from '../subsystem';
import { MethodsService } from '../methods.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subsystem-list',
  templateUrl: './subsystem-list.component.html',
  styleUrls: ['./subsystem-list.component.css']
})
export class SubsystemListComponent implements OnInit {
  subsystems: Subsystem[]
  message: string = ''

  constructor(
    private methodsService: MethodsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Reset message on page load
    this.message = ''

    // Service will tell when data loading failed!
    this.methodsService.warnings.subscribe(signal => {
      this.message = signal
    });
    
    this.route.params.subscribe( params => {
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
    this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.getMethods();
    });
    // If json data is loaded update event will not be emited.
    // This line must be after subscription (data may be changed while we start subscription)
    this.getMethods();
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
