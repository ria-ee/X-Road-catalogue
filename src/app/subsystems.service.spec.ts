import { SubsystemsService } from './subsystems.service';
import { of, defer } from 'rxjs';
import { Subsystem } from './subsystem';
import { Method } from './method';
import { HttpErrorResponse } from '@angular/common/http';
import { tick, fakeAsync } from '@angular/core/testing';
import { AppConfigMock } from './app.config-mock';

describe('SubsystemsService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let service: SubsystemsService;
  let config: AppConfigMock;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    config = new AppConfigMock(httpClientSpy as any);
    service = new SubsystemsService(httpClientSpy as any, config);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set instance on HTTP OK', () => {
    const sourceSubsystems = [
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER',
        methods: [
          {
            methodStatus: 'OK',
            serviceCode: 'SERVICE',
            wsdl: 'URL',
            serviceVersion: 'VER'
          }
        ]
      },
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER2',
        methods: []
      }
    ];
    const expectedSubsystems = [
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: [
          {
            methodStatus: 'OK',
            serviceCode: 'SERVICE',
            wsdl: 'URL',
            serviceVersion: 'VER',
            fullMethodName: 'INST/CLASS/MEMBER/SYSTEM/SERVICE/VER'
          }
        ]
      },
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER2',
        fullSubsystemName: 'INST/CLASS/MEMBER2/SYSTEM',
        methods: []
      }
    ];
    httpClientSpy.get.and.returnValue(of(sourceSubsystems));
    // Setting value to test resetting of values
    service.subsystemsSubject.next([new Subsystem()]);
    service.filteredSubsystemsSubject.next([new Subsystem()]);
    service.setInstance('EE');
    expect(httpClientSpy.get).toHaveBeenCalledWith('https://www.x-tee.ee/catalogue/EE/wsdls/index.json');
    expect(service.subsystemsSubject.value).toEqual(expectedSubsystems);
    // No filters yet
    expect(service.filteredSubsystemsSubject.value).toEqual(expectedSubsystems);
  });

  it('should set instance on HTTP ERROR', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({error: 'error', status: 404, statusText: 'Not Found'});
    httpClientSpy.get.and.returnValue(defer(() => Promise.reject(errorResponse)));
    // Setting value to test resetting of values
    service.subsystemsSubject.next([new Subsystem()]);
    service.filteredSubsystemsSubject.next([new Subsystem()]);
    service.setInstance('EE');
    // Waiting for some (unknown) asynchronous work
    tick();
    expect(httpClientSpy.get).toHaveBeenCalledWith('https://www.x-tee.ee/catalogue/EE/wsdls/index.json');
    expect(service.subsystemsSubject.value).toEqual([]);
    expect(service.filteredSubsystemsSubject.value).toEqual([]);
  }));

  it('should filter nonEmpty subsystems', () => {
    const sourceSubsystems = [
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: [{} as Method]
      },
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER2',
        fullSubsystemName: 'INST/CLASS/MEMBER2/SYSTEM',
        methods: []
      }
    ];
    const expectedSubsystems = [
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: [{} as Method]
      }
    ];
    service.subsystemsSubject.next(sourceSubsystems);
    service.setNonEmpty(true);
    expect(service.filteredSubsystemsSubject.value).toEqual(expectedSubsystems);
  });

  it('should set filter for subsystems', fakeAsync(() => {
    const sourceSubsystems = [
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: [
          {
            methodStatus: 'OK',
            serviceCode: 'SERVICE',
            wsdl: 'URL',
            serviceVersion: 'VER',
            fullMethodName: 'INST/CLASS/MEMBER/SYSTEM/SERVICE/VER'
          },
          {
            methodStatus: 'OK',
            serviceCode: 'SERVICE2',
            wsdl: 'URL',
            serviceVersion: 'VER',
            fullMethodName: 'INST/CLASS/MEMBER/SYSTEM/SERVICE2/VER'
          }
        ]
      },
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER2',
        fullSubsystemName: 'INST/CLASS/MEMBER2/SYSTEM',
        methods: []
      }
    ];
    const expectedSubsystems1 = [
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER2',
        fullSubsystemName: 'INST/CLASS/MEMBER2/SYSTEM',
        methods: []
      }
    ];
    const expectedSubsystems2 = [
      {
        memberClass: 'CLASS',
        subsystemCode: 'SYSTEM',
        xRoadInstance: 'INST',
        subsystemStatus: 'OK',
        memberCode: 'MEMBER',
        fullSubsystemName: 'INST/CLASS/MEMBER/SYSTEM',
        methods: [
          {
            methodStatus: 'OK',
            serviceCode: 'SERVICE2',
            wsdl: 'URL',
            serviceVersion: 'VER',
            fullMethodName: 'INST/CLASS/MEMBER/SYSTEM/SERVICE2/VER'
          }
        ]
      }
    ];
    service.subsystemsSubject.next(sourceSubsystems);

    // Search member without methods
    service.setFilter('MEMBER2');
    // Waiting for a debounce time to apply filter
    tick(config.getConfig('FILTER_DEBOUNCE'));
    expect(service.filteredSubsystemsSubject.value).toEqual(expectedSubsystems1);

    // Search member with multiple methods
    service.setFilter('SERVICE2');
    // Waiting for a debounce time to apply filter
    tick(config.getConfig('FILTER_DEBOUNCE'));
    expect(service.filteredSubsystemsSubject.value).toEqual(expectedSubsystems2);

    // Search with limit
    const sourceSubsystems2 = [];
    for (let i = 0; i < config.getConfig('DEFAULT_LIMIT') + 1; i++) {
      sourceSubsystems2.push(
        {
          memberClass: 'CLASS',
          subsystemCode: 'SYSTEM',
          xRoadInstance: 'INST',
          subsystemStatus: 'OK',
          memberCode: 'MEMBER' + i,
          fullSubsystemName: 'INST/CLASS/MEMBER' + i + '/SYSTEM',
          methods: []
        }
      );
    }
    service.subsystemsSubject.next(sourceSubsystems2);
    service.setFilter('MEMBER');
    // Waiting for a debounce time to apply filter
    tick(config.getConfig('FILTER_DEBOUNCE'));
    expect(service.filteredSubsystemsSubject.value.length).toEqual(config.getConfig('DEFAULT_LIMIT'));
  }));

  it('should set limit', () => {
    const sourceSubsystems = [];
    for (let i = 0; i < 51; i++) {
      sourceSubsystems.push(
        {
          memberClass: 'CLASS',
          subsystemCode: 'SYSTEM',
          xRoadInstance: 'INST',
          subsystemStatus: 'OK',
          memberCode: 'MEMBER' + i,
          fullSubsystemName: 'INST/CLASS/MEMBER' + i + '/SYSTEM',
          methods: []
        }
      );
    }
    service.subsystemsSubject.next(sourceSubsystems);

    service.setLimit('all');
    expect(service.filteredSubsystemsSubject.value.length).toEqual(51);

    service.setLimit('50');
    expect(service.filteredSubsystemsSubject.value.length).toEqual(50);

    service.setLimit('20');
    expect(service.filteredSubsystemsSubject.value.length).toEqual(20);

    service.setLimit('10');
    expect(service.filteredSubsystemsSubject.value.length).toEqual(10);

    // Should set default limit of 10
    service.setLimit('5');
    expect(service.filteredSubsystemsSubject.value.length).toEqual(10);
  });

  it('getLimit should work', () => {
    expect(service.getLimit()).toEqual(config.getConfig('DEFAULT_LIMIT').toString());

    service.setLimit('all');
    expect(service.getLimit()).toEqual('all');
  });

  it('getLimits should work', () => {
    expect(service.getLimits()).toEqual(config.getConfig('LIMITS'));
  });

  it('getInstances should work', () => {
    expect(service.getInstances()).toEqual(Object.keys(config.getConfig('INSTANCES')));
  });

  it('getDefaultInstance should work', () => {
    expect(service.getDefaultInstance()).toEqual(Object.keys(config.getConfig('INSTANCES'))[0]);
  });

  it('getInstance should work', () => {
    // Default value
    expect(service.getInstance()).toEqual('');
  });

  it('getApiUrlBase should work', () => {
    // Default value
    expect(service.getApiUrlBase()).toEqual('');
  });
});
