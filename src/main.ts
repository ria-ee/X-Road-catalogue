import { enableProdMode, provideAppInitializer, inject, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppConfig } from './app/app.config';
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

// Providing path as a workaround for ngx-translate bug with --base-href option
export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/');

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule, TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        })),
        AppConfig,
        provideAppInitializer(() => {
            const initializerFn = ((config: AppConfig) => () => config.load())(inject(AppConfig));
            return initializerFn();
        }),
        provideHttpClient(withInterceptorsFromDi())
    ]
}).catch(err => console.error(err));
