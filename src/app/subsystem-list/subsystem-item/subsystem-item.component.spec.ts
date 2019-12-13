import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SubsystemItemComponent } from './subsystem-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SubsystemsService } from 'src/app/subsystems.service';
import { Router } from '@angular/router';
import { Method } from 'src/app/method';
import { AppConfigMock } from 'src/app/app.config-mock';
import { AppConfig } from 'src/app/app.config';
import { Service } from 'src/app/service';

const PREVIEW_SIZE = 5;

describe('SubsystemItemComponent', () => {
  let component: SubsystemItemComponent;
  let fixture: ComponentFixture<SubsystemItemComponent>;
  let subsystemsService: SubsystemsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubsystemItemComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl')
        }},
        { provide: AppConfig, useClass: AppConfigMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    subsystemsService = TestBed.get(SubsystemsService);
    spyOn(subsystemsService, 'getApiUrlBase').and.returnValue(null);

    fixture = TestBed.createComponent(SubsystemItemComponent);
    component = fixture.componentInstance;
    component.subsystem = {
      xRoadInstance: 'INST',
      memberClass: 'CLASS',
      memberCode: 'CODE',
      subsystemCode: 'SUB',
      subsystemStatus: 'OK',
      servicesStatus: 'OK',
      fullSubsystemName: 'INST/CLASS/CODE/SUB',
      methods: [],
      services: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getApiUrlBase should work', () => {
    component.getApiUrlBase();
    expect(subsystemsService.getApiUrlBase).toHaveBeenCalled();
  });

  it('should preview methods', () => {
    expect(component.getMethodsPreview().length).toBe(0);
    for (let i = 0; i < PREVIEW_SIZE + 10; i++) {
      component.subsystem.methods.push(new Method());
    }
    expect(component.getMethodsPreview().length).toBe(PREVIEW_SIZE);
  });

  it('should preview services', () => {
    expect(component.getServicesPreview().length).toBe(0);
    for (let i = 0; i < PREVIEW_SIZE + 10; i++) {
      component.subsystem.services.push(new Service());
    }
    expect(component.getServicesPreview().length).toBe(PREVIEW_SIZE);
  });

  it('should calculate methods not in preview', () => {
    expect(component.getMethodsNotInPreview()).toBe(0);
    for (let i = 0; i < PREVIEW_SIZE + 10; i++) {
      component.subsystem.methods.push(new Method());
    }
    expect(component.getMethodsNotInPreview()).toBe(10);
  });

  it('should calculate services not in preview', () => {
    expect(component.getServicesNotInPreview()).toBe(0);
    for (let i = 0; i < PREVIEW_SIZE + 10; i++) {
      component.subsystem.services.push(new Service());
    }
    expect(component.getServicesNotInPreview()).toBe(10);
  });

  it('should go to detail view', () => {
    const spy = TestBed.get(Router).navigateByUrl;
    component.showDetail();
    expect(spy).toHaveBeenCalledWith('/INST/CLASS/CODE/SUB');

    spy.calls.reset();
    spyOn(subsystemsService, 'getInstanceVersion').and.returnValue('12345');
    component.showDetail();
    expect(spy).toHaveBeenCalledWith('/INST/CLASS/CODE/SUB?at=12345');
  });
});
