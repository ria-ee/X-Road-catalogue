import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { Subsystem } from '../subsystem';
import { ActivatedRoute, Router } from '@angular/router';
//import { Location } from '@angular/common';

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
    //private location: Location
  ) { }

  ngOnInit() {
    this.getSubsystem()
  }

  loadingDone():boolean {
    return this.methodsService.isLoadingDone()
  }

  getSubsystem() {
    this.subsystemId = this.route.snapshot.paramMap.get('id')
    this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
    // Service will tell when updated data is available!
    this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.subsystem = this.methodsService.getSubsystem(this.subsystemId)
    });
  }

  goToList(): void {
    //this.location.back();
    this.router.navigateByUrl('/list')
  }
}
