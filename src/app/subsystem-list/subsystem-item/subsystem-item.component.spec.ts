import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { SubsystemItemComponent } from './subsystem-item.component';
import { SubsystemsService } from '../../subsystems.service';
import { Router } from '@angular/router';
import { Method } from '../../method';
import { AppConfigMock } from '../../app.config-mock';
import { AppConfig } from '../../app.config';
import { Service } from '../../service';

const PREVIEW_SIZE = 5;

describe('SubsystemItemComponent', () => {
  let component: SubsystemItemComponent;
  let fixture: ComponentFixture<SubsystemItemComponent>;
  let subsystemsService: SubsystemsService;
  //let router: Router;

  beforeEach(waitForAsync(() => {
    const routerSpy = {
      navigateByUrl: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SubsystemItemComponent
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AppConfig, useClass: AppConfigMock },
        provideHttpClient()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    subsystemsService = TestBed.inject(SubsystemsService);
    jest.spyOn(subsystemsService, 'getApiUrlBase').mockReturnValue(null);

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
    //router = TestBed.inject(Router);
    TestBed.inject(Router);
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
    const injected = TestBed.inject(Router) as jest.Mocked<Router>;
    const spy = injected.navigateByUrl;
    component.showDetail();
    expect(spy).toHaveBeenCalledWith('/INST/CLASS/CODE/SUB');

    spy.mockClear();
    jest.spyOn(subsystemsService, 'getInstanceVersion').mockReturnValue('12345');
    component.showDetail();
    expect(spy).toHaveBeenCalledWith('/INST/CLASS/CODE/SUB?at=12345');
  });
});
