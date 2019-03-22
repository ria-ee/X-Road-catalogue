import { AppModule, HttpLoaderFactory } from './app.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

describe('AppModule', () => {
  let module: AppModule;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    module = new AppModule();
  });

  it('should be created', () => {
    expect(module).toBeTruthy();
  });

  it('HttpLoaderFactory should work', () => {
    expect(HttpLoaderFactory(httpClientSpy as any) instanceof TranslateHttpLoader).toBeTruthy();
  });
});
