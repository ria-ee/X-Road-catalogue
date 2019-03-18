import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing'
import { SubsystemListComponent } from './subsystem-list.component';
import { Component, Input } from '@angular/core';
import { Subsystem } from '../subsystem';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
  
@Component({selector: 'app-header', template: ''})
class HeaderStubComponent {}
@Component({selector: 'app-search', template: ''})
class SearchStubComponent {}
@Component({selector: 'app-subsystem-item', template: ''})
class SubsystemItemStubComponent {
  @Input() subsystem: Subsystem
}

describe('SubsystemListComponent', () => {
  let component: SubsystemListComponent;
  let fixture: ComponentFixture<SubsystemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubsystemListComponent,
        HeaderStubComponent,
        SearchStubComponent,
        SubsystemItemStubComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Mocks and spies
    TestBed.get(ActivatedRoute).params = of({
      "instance": "EE"
    })
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});