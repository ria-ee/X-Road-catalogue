import { TestBed } from '@angular/core/testing';
import { LanguagesService } from './languages.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('LanguagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot()
    ]
  }));

  it('should be created', () => {
    const service: LanguagesService = TestBed.get(LanguagesService);
    expect(service).toBeTruthy();
  });

  it('should set default lang with empty localStorage', () => {
    const translateService: TranslateService = TestBed.get(TranslateService);
    spyOn(translateService, 'setDefaultLang');
    spyOn(window.localStorage, 'getItem').and.returnValue(undefined);
    TestBed.get(LanguagesService);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('est');
  });

  it('should set default lang from localStorage', () => {
    const translateService: TranslateService = TestBed.get(TranslateService);
    spyOn(translateService, 'setDefaultLang');
    spyOn(window.localStorage, 'getItem').and.returnValue('ENG');
    TestBed.get(LanguagesService);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('eng');
  });

  it('should set language', () => {
    const translateService: TranslateService = TestBed.get(TranslateService);
    spyOn(translateService, 'use');
    const service = TestBed.get(LanguagesService);
    service.setLang('ENG');
    expect(translateService.use).toHaveBeenCalledWith('eng');
  });
});
