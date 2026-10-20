import { TestBed } from '@angular/core/testing';
import { LanguagesService } from './languages.service';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { AppConfigMock } from './app.config-mock';
import { AppConfig } from './app.config';
import { provideHttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';

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

  it('should not subscribe again while title subscription is in progress', () => {
    const translateService: TranslateService = TestBed.inject(TranslateService);
    vi.spyOn(translateService, 'use').mockImplementation(() => of({}));
    // Never emitting, so that the subscription of the constructor stays open
    vi.spyOn(translateService, 'get').mockImplementation(() => new Subject<string>());
    const service = TestBed.inject(LanguagesService);
    expect(translateService.get).toHaveBeenCalledTimes(1);

    service.updateTitle();
    expect(translateService.get).toHaveBeenCalledTimes(1);
  });

  it('should set language without localStorage', () => {
    const translateService: TranslateService = TestBed.inject(TranslateService);
    vi.spyOn(translateService, 'use').mockImplementation(() => of({}));
    const service = TestBed.inject(LanguagesService);
    // Removing localStorage only after construction, so that getFallbackLang() can still use it
    const localStorageSpy = vi.spyOn(window, 'localStorage', 'get')
      .mockReturnValue(undefined as unknown as Storage);
    try {
      service.setLang('ENG');
    } finally {
      // Restoring before afterEach(), which needs localStorage
      localStorageSpy.mockRestore();
    }
    expect(service.getLang()).toBe('ENG');
    expect(translateService.use).toHaveBeenCalledWith('eng');
  });
});
