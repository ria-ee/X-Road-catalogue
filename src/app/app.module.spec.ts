import { AppModule, httpLoaderFactory } from './app.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppConfig } from './app.config';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

describe('AppModule', () => {
  let appModule: AppModule;
  let httpClientSpy: { get: jest.SpyInstance };
  let appConfigSpy: { load: jest.SpyInstance };

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    };
    appConfigSpy = {
      load: jest.fn()
    };
    appModule = new AppModule();
  });

  it('should be created', () => {
    expect(appModule).toBeTruthy();
  });

  it('HttpLoaderFactory should work', () => {
    expect(httpLoaderFactory(httpClientSpy as any) instanceof TranslateHttpLoader).toBeTruthy();
  });

  it('AppConfig should be initialized', async () => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [
        { provide: AppConfig, useValue: appConfigSpy },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
    expect(TestBed.inject(AppConfig)).toBeTruthy();
    expect(appConfigSpy.load).toHaveBeenCalledTimes(1);
  });
});
