import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SubsystemsService } from './subsystems.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from './app.module';

describe('SubsystemsService', () => {
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
    const service: SubsystemsService = TestBed.get(SubsystemsService);
    expect(service).toBeTruthy();
  });
});