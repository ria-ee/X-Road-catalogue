import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { MessagesComponent } from './messages/messages.component';

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
        useFactory: HttpLoaderFactory,
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

export function HttpLoaderFactory(http: HttpClient) {
  // Providing path as a workaround for ngx-translate bug with --base-href option
  return new TranslateHttpLoader(http, './assets/i18n/');
}
