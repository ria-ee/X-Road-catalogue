import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SubsystemItemComponent } from './subsystem-item.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SubsystemItemComponent', () => {
  let component: SubsystemItemComponent;
  let fixture: ComponentFixture<SubsystemItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubsystemItemComponent        
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
    fixture = TestBed.createComponent(SubsystemItemComponent);
    component = fixture.componentInstance;

    component.subsystem = {
      xRoadInstance: "XRD",
      memberClass: "CLASS",
      memberCode: "CODE",
      subsystemCode: "SUB",
      subsystemStatus: "OK",
      fullSubsystemName: "XRD/CLASS/CODE/SUB",
      methods: []
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});