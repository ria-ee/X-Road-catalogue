import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SubsystemItemComponent } from './subsystem-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SubsystemsService } from 'src/app/subsystems.service';
import { Router } from '@angular/router';
import { PREVIEW_SIZE } from '../../config';
import { Method } from 'src/app/method';

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
        }}
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
      fullSubsystemName: 'INST/CLASS/CODE/SUB',
      methods: []
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

  it('should calculate methods not in preview', () => {
    expect(component.getNotInPreview()).toBe(0);
    for (let i = 0; i < PREVIEW_SIZE + 10; i++) {
      component.subsystem.methods.push(new Method());
    }
    expect(component.getNotInPreview()).toBe(10);
  });

  it('should go to detail view', () => {
    component.showDetail();
    expect(TestBed.get(Router).navigateByUrl).toHaveBeenCalledWith('/INST/CLASS/CODE/SUB');
  });
});
