import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { SubsystemListComponent } from './subsystem-list.component';
import { Component, Input } from '@angular/core';
import { Subsystem } from '../subsystem';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { of } from 'rxjs';
import { SubsystemsService } from '../subsystems.service';
import { ViewportScroller } from '@angular/common';
import { AppConfigMock } from '../app.config-mock';
import { AppConfig } from '../app.config';
import { FormsModule } from '@angular/forms';
import { Mocked } from 'vitest';

@Component({selector: 'app-header', template: ''})
class HeaderStubComponent {}
@Component({selector: 'app-messages', template: ''})
class MessagesStubComponent {
  @Input() message: string;
}
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        SubsystemListComponent,
        HeaderStubComponent,
        MessagesStubComponent,
        SearchStubComponent,
        SubsystemItemStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of({
            instance: 'INST'
          })
        }},
        { provide: Router, useValue: {
            events: of(new Scroll(null, [11, 12], null)),
            navigateByUrl: vi.fn()
        }},
        { provide: AppConfig, useClass: AppConfigMock },
        provideHttpClient()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    subsystemsService = TestBed.inject(SubsystemsService);
    getInstanceSpy = vi.spyOn(subsystemsService, 'getInstance').mockReturnValue('INST');
    getInstancesSpy = vi.spyOn(subsystemsService, 'getInstances').mockReturnValue(['INST']);
    vi.spyOn(TestBed.inject(ViewportScroller), 'scrollToPosition').mockImplementation(() => {/* do nothing */});
    vi.spyOn(subsystemsService, 'setInstance').mockReturnValue(null);
    vi.spyOn(subsystemsService, 'getDefaultInstance').mockReturnValue('DEFINST');
    vi.spyOn(TestBed.inject(SubsystemsService), 'getApiUrlBase').mockReturnValue('base');
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect on incorrect instance', () => {
    getInstancesSpy.mockReturnValue(['XXX']);
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith('/DEFINST', Object({ replaceUrl: true }));
  });

  it('should detect when instance is not selected', () => {
    getInstanceSpy.mockReturnValue('');
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST', '');
  });

  it('should detect change instance', () => {
    getInstanceSpy.mockReturnValue('INST2');
    getInstancesSpy.mockReturnValue(['INST', 'INST2']);
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subsystemsService.setInstance).toHaveBeenCalledWith('INST', '');
  });

  it('should scroll to position', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(TestBed.inject(ViewportScroller).scrollToPosition).toHaveBeenCalledWith([11, 12]);
  });

  it('switchInstance should work', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const injected = TestBed.inject(Router) as Mocked<Router>;
    const spy = injected.navigateByUrl;

    component.switchInstance('NEWINST');
    expect(spy).toHaveBeenCalledWith('/NEWINST');

    spy.mockClear();
    component.switchInstance('INST');
    expect(spy).toHaveBeenCalledWith('/INST');
  });

  it('should receive service warnings', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    subsystemsService.warnings.emit('WARN');
    expect(component.message).toBe('WARN');
  });

  it('scrollToTop should work', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const injected = TestBed.inject(ViewportScroller) as Mocked<ViewportScroller>;
    const spy = injected.scrollToPosition;
    spy.mockClear();
    component.scrollToTop();
    expect(spy).toHaveBeenCalledWith([0, 0]);
  });

  it('isPartialList should work', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    subsystemsService.filteredSubsystemsSubject.next([new Subsystem(), new Subsystem()]);

    const getLimitSpy = vi.spyOn(subsystemsService, 'getLimit').mockReturnValue('all');
    expect(component.isPartialList()).toBeFalsy();

    getLimitSpy.mockReturnValue('2');
    expect(component.isPartialList()).toBeTruthy();

    getLimitSpy.mockReturnValue('3');
    expect(component.isPartialList()).toBeFalsy();
  });

  it('setInstanceVersion should work without instance version', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.setInstanceVersion();
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith('/INST');
  });

  it('setMaxLimit should work', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    component.search = TestBed.createComponent(SearchStubComponent).componentInstance;
    fixture.detectChanges();
    component.search.setLimit = vi.fn();
    component.setMaxLimit();
    expect(component.search.setLimit).toHaveBeenCalledWith('all');
  });

  it('isIE should work', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('...MSIE 10...');
    expect(component.isIE()).toBeTruthy();
  });
});

describe('SubsystemListComponent (with instance version)', () => {
  let component: SubsystemListComponent;
  let fixture: ComponentFixture<SubsystemListComponent>;
  let subsystemsService: SubsystemsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        SubsystemListComponent,
        HeaderStubComponent,
        MessagesStubComponent,
        SearchStubComponent,
        SubsystemItemStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of({
            instance: 'INST'
          }),
          snapshot: {
            queryParams: {
              at: '12345'
            }
          }
        }},
        { provide: Router, useValue: {
            events: of(new Scroll(null, [11, 12], null)),
            navigateByUrl: vi.fn()
        }},
        { provide: AppConfig, useClass: AppConfigMock },
        provideHttpClient()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    subsystemsService = TestBed.inject(SubsystemsService);
    vi.spyOn(subsystemsService, 'getInstance').mockReturnValue('INST');
    vi.spyOn(subsystemsService, 'getInstances').mockReturnValue(['INST']);
    vi.spyOn(TestBed.inject(ViewportScroller), 'scrollToPosition').mockImplementation(() => {/* do nothing */});
    vi.spyOn(subsystemsService, 'setInstance').mockReturnValue(null);
    vi.spyOn(subsystemsService, 'getDefaultInstance').mockReturnValue('DEFINST');
    vi.spyOn(TestBed.inject(SubsystemsService), 'getApiUrlBase').mockReturnValue('base');
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.instanceVersion).toBe('12345');
  });

  it('setInstanceVersion should work with instance version', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.setInstanceVersion();
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith('/INST?at=12345');
  });

  it('switchInstance should reset instance version when instance does not change', () => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.instanceVersion = 'test';
    component.switchInstance('INST');
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith('/INST');
    expect(component.instanceVersion).toBe('');
  });
});
