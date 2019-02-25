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
  isHidden: boolean = true;

  constructor(private methodsService: MethodsService) {
    // Service will tell when detail should be opened or closed
    this.methodsService.hideDetails.subscribe(signal => {
      if (signal) {
        this.isHidden = true
      } else if (this.subsystem.methods.length) {
        // Force opening only subsystems with methods
        this.isHidden = false
      }
    });
  }

  ngOnInit() {
    // New component asks service if detail should be opened or closed
    if (this.subsystem.methods.length) {
      // Force opening only subsystems with methods
      this.isHidden = this.methodsService.getHideDetails()
    }
  }
}
