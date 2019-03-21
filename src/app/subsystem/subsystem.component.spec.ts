import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Component, EventEmitter } from '@angular/core';
import { SubsystemComponent } from './subsystem.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute, Scroll } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { SubsystemsService } from '../subsystems.service';
import { ViewportScroller } from '@angular/common';

@Component({selector: 'app-header', template: ''})
class HeaderStubComponent {}

describe('SubsystemComponent', () => {
  let component: SubsystemComponent;
  let fixture: ComponentFixture<SubsystemComponent>;
  let getInstanceSpy;
  let getInstancesSpy;
  let subsystemsService: SubsystemsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubsystemComponent,
        HeaderStubComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of({
            instance: 'INST',
            class: 'CLASS',
            member: 'MEMBER',
            subsystem: 'SYSTEM'
          })
        }},
        { provide: Router, useValue: {
            events: of(new Scroll(null, [11, 12], null)),
            navigateByUrl: jasmine.createSpy('navigateByUrl')
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    subsystemsService = TestBed.get(SubsystemsService);
    getInstanceSpy = spyOn(subsystemsService, 'getInstance').and.returnValue('INST');
    getInstancesSpy = spyOn(subsystemsService, 'getInstances').and.returnValue(['INST']);
    spyOn(TestBed.get(ViewportScroller), 'scrollToPosition');
    spyOn(subsystemsService, 'setInstance').and.returnValue(null);
    spyOn(TestBed.get(SubsystemsService), 'getApiUrlBase').and.returnValue('base');
    subsystemsService.subsystemsSubject = new BehaviorSubject([
      {
        memberClass: '',
        subsystemCode: '',
        xRoadInstance: '',
        subsystemStatus: '',
        memberCode: '',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: []
      }
    ]);
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should detect incorrect instance', () => {
    getInstancesSpy.and.returnValue(['XXX']);
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.message).toBe('Incorrect instance!');
  });

  it('should detect when instance is not selected', () => {
    getInstanceSpy.and.returnValue('');
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST');
  });

  it('should detect change instance', () => {
    getInstanceSpy.and.returnValue('INST2');
    getInstancesSpy.and.returnValue(['INST', 'INST2']);
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST');
  });

  it('should detect incorrect subsystem', () => {
    subsystemsService.subsystemsSubject = new BehaviorSubject([]);
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.message).toBe('Subsystem "INST/CLASS/MEMBER/SYSTEM" cannot be found!');
  });

  it('should scroll to position', () => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(TestBed.get(ViewportScroller).scrollToPosition).toHaveBeenCalledWith([11, 12]);
  });

  it('getApiUrlBase should work', () => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.getApiUrlBase();
    expect(subsystemsService.getApiUrlBase).toHaveBeenCalled();
  });

  it('goToList should work', () => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.goToList();
    expect(TestBed.get(Router).navigateByUrl).toHaveBeenCalledWith('/INST');
  });

  it('should receive service warnings', () => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    subsystemsService.warnings.emit('WARN');
    expect(component.message).toBe('WARN');
  });
});
