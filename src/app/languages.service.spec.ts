import { TestBed } from '@angular/core/testing';
import { LanguagesService } from './languages.service';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { AppConfigMock } from './app.config-mock';
import { AppConfig } from './app.config';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('LanguagesService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        { provide: AppConfig, useClass: AppConfigMock },
        provideHttpClient()
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    const service: LanguagesService = TestBed.inject(LanguagesService);
    expect(service).toBeTruthy();
  });

  it('should set default lang with empty localStorage', () => {
    const translateService: TranslateService = TestBed.inject(TranslateService);
    vi.spyOn(translateService, 'setFallbackLang').mockImplementation(() => of({}));
    TestBed.inject(LanguagesService);
    expect(translateService.setFallbackLang).toHaveBeenCalledWith('est');
  });

  it('should set default lang from localStorage', () => {
    localStorage.setItem('lang', 'ENG');
    const translateService: TranslateService = TestBed.inject(TranslateService);
    vi.spyOn(translateService, 'setFallbackLang').mockImplementation(() => of({}));
    TestBed.inject(LanguagesService);
    expect(translateService.setFallbackLang).toHaveBeenCalledWith('eng');
  });

  it('should set language', () => {
    const translateService: TranslateService = TestBed.inject(TranslateService);
    vi.spyOn(translateService, 'use').mockImplementation(() => of({}));
    const service = TestBed.inject(LanguagesService);
    service.setLang('ENG');
    expect(translateService.use).toHaveBeenCalledWith('eng');
  });
});
