import { Component, OnInit } from '@angular/core';
import { Subsystem } from '../subsystem';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-subsystem-list',
  templateUrl: './subsystem-list.component.html',
  styleUrls: ['./subsystem-list.component.css']
})
export class SubsystemListComponent implements OnInit {
  subsystems: Subsystem[];

  constructor(private methodsService: MethodsService) { }

  ngOnInit() {
    // Service will tell when updated data is available!
    this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.getMethods();
    });
    // If json data is loaded update event will not be emited.
    // This line must be after subscription (data may be changed while we start subscription)
    this.getMethods();
  }

  getMethods(): void {
    this.subsystems = this.methodsService.getMethods();
  }
}
