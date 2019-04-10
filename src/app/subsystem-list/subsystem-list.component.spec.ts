import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SubsystemListComponent } from './subsystem-list.component';
import { Component, Input } from '@angular/core';
import { Subsystem } from '../subsystem';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { of } from 'rxjs';
import { SubsystemsService } from '../subsystems.service';
import { ViewportScroller } from '@angular/common';
import { AppConfigMock } from 'src/app/app.config-mock';
import { AppConfig } from 'src/app/app.config';

@Component({selector: 'app-header', template: ''})
class HeaderStubComponent {}
@Component({selector: 'app-search', template: ''})
class SearchStubComponent {}
@Component({selector: 'app-subsystem-item', template: ''})
class SubsystemItemStubComponent {
  @Input() subsystem: Subsystem;
}

describe('SubsystemListComponent', () => {
  let component: SubsystemListComponent;
  let fixture: ComponentFixture<SubsystemListComponent>;
  let getInstanceSpy;
  let getInstancesSpy;
  let subsystemsService: SubsystemsService;

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
        HttpClientModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of({
            instance: 'INST'
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
    spyOn(subsystemsService, 'getDefaultInstance').and.returnValue('DEFINST');
    spyOn(TestBed.get(SubsystemsService), 'getApiUrlBase').and.returnValue('base');
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect on incorrect instance', () => {
    getInstancesSpy.and.returnValue(['XXX']);
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(TestBed.get(Router).navigateByUrl).toHaveBeenCalledWith('/DEFINST');
  });

  it('should detect when instance is not selected', () => {
    getInstanceSpy.and.returnValue('');
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST');
  });

  it('should detect change instance', () => {
    getInstanceSpy.and.returnValue('INST2');
    getInstancesSpy.and.returnValue(['INST', 'INST2']);
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST');
  });

  it('should scroll to position', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(TestBed.get(ViewportScroller).scrollToPosition).toHaveBeenCalledWith([11, 12]);
  });

  it('switchInstance should work', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.switchInstance('NEWINST');
    expect(TestBed.get(Router).navigateByUrl).toHaveBeenCalledWith('/NEWINST');
  });

  it('should receive service warnings', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    subsystemsService.warnings.emit('WARN');
    expect(component.message).toBe('WARN');
  });
});
