import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SubsystemListComponent } from './subsystem-list/subsystem-list.component';
import { SearchComponent } from './subsystem-list/search/search.component';
import { SubsystemItemComponent } from './subsystem-list/subsystem-item/subsystem-item.component';
import { AppRoutingModule } from './app-routing.module';
import { SubsystemComponent } from './subsystem/subsystem.component';
import { HeaderComponent } from './header/header.component';
import { AppConfig } from './app.config';
import { MessagesComponent } from './messages/messages.component';

// Providing path as a workaround for ngx-translate bug with --base-href option
export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/');

@NgModule({
  declarations: [
    AppComponent,
    SubsystemListComponent,
    SearchComponent,
    SubsystemItemComponent,
    SubsystemComponent,
    HeaderComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
