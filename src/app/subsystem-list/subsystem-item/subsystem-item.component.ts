import { Component, OnInit, Input } from '@angular/core';
import { Subsystem } from '../../subsystem';
import { Method } from '../../method';
import { SubsystemsService } from '../../subsystems.service';
import { Router } from '@angular/router';
import { PREVIEW_SIZE } from '../../config'

@Component({
  selector: 'app-subsystem-item',
  templateUrl: './subsystem-item.component.html',
  styleUrls: ['./subsystem-item.component.css']
})
export class SubsystemItemComponent implements OnInit {
  @Input() subsystem: Subsystem

  constructor(
    private subsystemsService: SubsystemsService,
    private router: Router
  ) { }

  getApiUrlBase(): string {
    return this.subsystemsService.getApiUrlBase()
  }

  getMethodsPreview(): Method[] {
    return this.subsystem.methods.length ? this.subsystem.methods.slice(0, PREVIEW_SIZE) : []
  }

  getNotInPreview(): number {
    if (this.subsystem.methods.length - PREVIEW_SIZE < 0) {
      return 0
    }
    return this.subsystem.methods.length - PREVIEW_SIZE
  }

  showDetail() {
    this.router.navigateByUrl(
      '/' + this.subsystem.xRoadInstance
      + '/' + this.subsystem.memberClass
      + '/' + this.subsystem.memberCode
      + '/' + this.subsystem.subsystemCode
    )
  }

  ngOnInit() {}
}
