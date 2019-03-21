import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SubsystemsService } from './subsystems.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('SubsystemsService', () => {
  let service: SubsystemsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot(),
      HttpClientTestingModule
    ]
  }));

  beforeEach(() => {
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SubsystemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*it('should set instance', () => {
    service.setInstance('EE');
    // expect(service).toBeTruthy();
    // httpTestingController.expectOne('https://x-tee.ee/catalogue/EE/wsdls/index.json');
  });*/
});
