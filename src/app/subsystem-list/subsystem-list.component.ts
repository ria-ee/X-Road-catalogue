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
    this.getMethods();
    // Service will tell when updated data is available!
    this.methodsService.subsystemsUpdated.subscribe(signal => {
      this.getMethods();
    });
  }

  getMethods(): void {
    this.subsystems = this.methodsService.getMethods();
  }
}
