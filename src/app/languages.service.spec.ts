import { TestBed } from '@angular/core/testing';
import { LanguagesService } from './languages.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppConfigMock } from 'src/app/app.config-mock';
import { AppConfig } from 'src/app/app.config';
import { HttpClientModule } from '@angular/common/http';

describe('LanguagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot(),
      HttpClientModule
    ],
    providers: [
      { provide: AppConfig, useClass: AppConfigMock }
    ]
  }));

  it('should be created', () => {
    const service: LanguagesService = TestBed.inject(LanguagesService);
    expect(service).toBeTruthy();
  });

  it('should set default lang with empty localStorage', () => {
    const translateService: TranslateService = TestBed.inject(TranslateService);
    spyOn(translateService, 'setDefaultLang');
    spyOn(window.localStorage, 'getItem').and.returnValue(undefined);
    TestBed.inject(LanguagesService);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('est');
  });

  it('should set default lang from localStorage', () => {
    const translateService: TranslateService = TestBed.inject(TranslateService);
    spyOn(translateService, 'setDefaultLang');
    spyOn(window.localStorage, 'getItem').and.returnValue('ENG');
    TestBed.inject(LanguagesService);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('eng');
  });

  it('should set language', () => {
    const translateService: TranslateService = TestBed.inject(TranslateService);
    spyOn(translateService, 'use');
    const service = TestBed.inject(LanguagesService);
    service.setLang('ENG');
    expect(translateService.use).toHaveBeenCalledWith('eng');
  });
});
