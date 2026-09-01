import { enableProdMode, provideAppInitializer, inject, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { AppConfig } from './app/app.config';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule),
        provideTranslateService({
            loader: provideTranslateHttpLoader({prefix:"./assets/i18n/", suffix:".json"})
        }),
        AppConfig,
        provideAppInitializer(() => {
            const initializerFn = ((config: AppConfig) => () => config.load())(inject(AppConfig));
            return initializerFn();
        }),
        provideHttpClient(withXhr(), withInterceptorsFromDi())
    ]
}).catch(err => console.error(err));
