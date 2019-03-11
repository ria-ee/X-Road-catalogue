import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MethodsService } from './methods.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from './app.module';

describe('MethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
      }),
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: MethodsService = TestBed.get(MethodsService);
    expect(service).toBeTruthy();
  });
});