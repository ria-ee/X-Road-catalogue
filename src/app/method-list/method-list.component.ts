import { Component, OnInit } from '@angular/core';
import { Subsystem } from '../subsystem';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-method-list',
  templateUrl: './method-list.component.html',
  styleUrls: ['./method-list.component.css']
})
export class MethodListComponent implements OnInit {
  subsystems: Subsystem[];

  constructor(private methodsService: MethodsService) { }

  ngOnInit() {
    this.getMethods();
  }

  getMethods(): void {
    this.methodsService.getMethods()
      .subscribe(subsystems => this.subsystems = subsystems.slice(0, 50));
  }
}
