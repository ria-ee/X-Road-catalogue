import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { SubsystemComponent } from './subsystem.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute, Scroll } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { SubsystemsService } from '../subsystems.service';
import { ViewportScroller } from '@angular/common';
import { AppConfigMock } from 'src/app/app.config-mock';
import { AppConfig } from 'src/app/app.config';

@Component({selector: 'app-header', template: ''})
class HeaderStubComponent {}
@Component({selector: 'app-messages', template: ''})
class MessagesStubComponent {
  @Input() message: string;
  @Input() subsystemId: string;
}

describe('SubsystemComponent', () => {
  let component: SubsystemComponent;
  let fixture: ComponentFixture<SubsystemComponent>;
  let getInstanceSpy;
  let getInstancesSpy;
  let subsystemsService: SubsystemsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubsystemComponent,
        HeaderStubComponent,
        MessagesStubComponent
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
        }},
        { provide: AppConfig, useClass: AppConfigMock }
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
        servicesStatus: '',
        memberCode: '',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: [],
        services: []
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
    expect(component.message).toBe('subsystem.incorrectInstanceWarning');
  });

  it('should detect when instance is not selected', () => {
    getInstanceSpy.and.returnValue('');
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST', '');
  });

  it('should detect change instance', () => {
    getInstanceSpy.and.returnValue('INST2');
    getInstancesSpy.and.returnValue(['INST', 'INST2']);
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST', '');
  });

  it('should detect incorrect subsystem', () => {
    subsystemsService.subsystemsSubject = new BehaviorSubject([
      {
        memberClass: '',
        subsystemCode: '',
        xRoadInstance: '',
        subsystemStatus: '',
        servicesStatus: '',
        memberCode: '',
        fullSubsystemName: 'INST/CLASS/MEMBER2/SYSTEM',
        methods: [],
        services: []
      }
    ]);
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.message).toBe('subsystem.subsystemNotFoundWarning');
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

  it('scrollToTop should work', () => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const spy = TestBed.get(ViewportScroller).scrollToPosition;
    spy.calls.reset();
    component.scrollToTop();
    expect(spy).toHaveBeenCalledWith([0, 0]);
  });
});


describe('SubsystemComponent (with instance version)', () => {
  let component: SubsystemComponent;
  let fixture: ComponentFixture<SubsystemComponent>;
  let getInstanceSpy;
  let getInstancesSpy;
  let subsystemsService: SubsystemsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubsystemComponent,
        HeaderStubComponent,
        MessagesStubComponent
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
          }),
          snapshot: {
            queryParams: {
              at: '12345'
            }
          }
        }},
        { provide: Router, useValue: {
            events: of(new Scroll(null, [11, 12], null)),
            navigateByUrl: jasmine.createSpy('navigateByUrl')
        }},
        { provide: AppConfig, useClass: AppConfigMock }
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
        servicesStatus: '',
        memberCode: '',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: [],
        services: []
      }
    ]);
  });

  it('goToList should work with instance version', () => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.goToList();
    expect(TestBed.get(Router).navigateByUrl).toHaveBeenCalledWith('/INST?at=12345');
  });
});
