import { AppModule, HttpLoaderFactory } from './app.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppConfig } from './app.config';
import { TestBed } from '@angular/core/testing';

describe('AppModule', () => {
  let appModule: AppModule;
  let httpClientSpy: { get: jasmine.Spy };
  let appConfigSpy: { load: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    appConfigSpy = jasmine.createSpyObj('HttpClient', ['load']);
    appModule = new AppModule();
  });

  it('should be created', () => {
    expect(appModule).toBeTruthy();
  });

  it('HttpLoaderFactory should work', () => {
    expect(HttpLoaderFactory(httpClientSpy as any) instanceof TranslateHttpLoader).toBeTruthy();
  });

  it('AppConfig should be initialized', async () => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [
        { provide: AppConfig, useValue: appConfigSpy }
      ]
    });
    expect(TestBed.get(AppConfig)).toBeTruthy();
    expect(appConfigSpy.load).toHaveBeenCalledTimes(1);
  });
});
