import { Component, OnInit, Input } from '@angular/core';
import { Subsystem } from '../../subsystem';
import { Method } from '../../method';
import { MethodsService } from '../../methods.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subsystem-item',
  templateUrl: './subsystem-item.component.html',
  styleUrls: ['./subsystem-item.component.css']
})
export class SubsystemItemComponent implements OnInit {

  @Input() subsystem: Subsystem
  private previewSize: number = 5

  constructor(
    private methodsService: MethodsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  getMethodsPreview(): Method[] {
    return this.subsystem.methods.length ? this.subsystem.methods.slice(0, this.previewSize) : []
  }

  getNotInPreview(): number {
    if (this.subsystem.methods.length - this.previewSize < 0) {
      return 0
    }
    return this.subsystem.methods.length - this.previewSize
  }

  showDetail() {
    this.router.navigateByUrl('/subsystem/' + encodeURIComponent(this.subsystem.fullSubsystemName))
  }
}
