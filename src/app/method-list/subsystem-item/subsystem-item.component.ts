import { Component, OnInit, Input } from '@angular/core';
import { Subsystem } from '../../subsystem';
import { MethodsService } from '../../methods.service';

@Component({
  selector: 'app-subsystem-item',
  templateUrl: './subsystem-item.component.html',
  styleUrls: ['./subsystem-item.component.css']
})
export class SubsystemItemComponent implements OnInit {

  @Input() subsystem: Subsystem;
  subsystemName: string;
  isHidden: boolean = true;

  constructor(private methodsService: MethodsService) { }

  ngOnInit() {
    this.subsystemName = this.subsystem.xRoadInstance + '/' + this.subsystem.memberClass
      + '/' + this.subsystem.memberCode + '/' + this.subsystem.subsystemCode
  }

}
