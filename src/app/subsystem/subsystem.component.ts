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

  constructor(
    private methodsService: MethodsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getSubsystem()
  }

  loadingDone():boolean {
    return this.methodsService.isLoadingDone()
  }

  getSubsystem() {
    this.subsystemId = this.route.snapshot.paramMap.get('id')
    // Service will tell when data has finished loading
    this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
    });
    // If json data is loaded update event will not be emited.
    // This line must be after subscription (data may be changed while we start subscription)
    this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
  }

  getApiUrlBase(): string {
    return this.methodsService.getApiUrlBase()
  }

  goToList(): void {
    this.router.navigateByUrl('/')
  }
}
