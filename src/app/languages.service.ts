import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private selectedLang = '';
  private translateSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private title: Title,
    private config: AppConfig
  ) {
    this.selectedLang = this.getDefaultLang();
    translate.setDefaultLang(this.config.getConfig('LANGUAGES')[this.selectedLang]);
    this.updateTitle();
  }

  updateTitle(): void {
    // Not subscribing if subscription already in progress
    if (!this.translateSubscription || this.translateSubscription.closed) {
      this.translateSubscription = this.translate.get('index.title').pipe(take(1)).subscribe((res: string) => {
        this.title.setTitle(res);
      });
    }
  }

  getDefaultLang(): string {
    if (window && window.localStorage && window.localStorage.getItem('lang')) {
      return window.localStorage.getItem('lang');
    }
    return Object.keys(this.config.getConfig('LANGUAGES'))[0];
  }

  getLangs(): string[] {
    return Object.keys(this.config.getConfig('LANGUAGES'));
  }

  getLang(): string {
    return this.selectedLang;
  }

  setLang(lang: string): void {
    this.selectedLang = lang;
    if (window && window.localStorage) {
      window.localStorage.setItem('lang', this.selectedLang);
    }
    this.translate.use(this.config.getConfig('LANGUAGES')[this.selectedLang]);
    this.updateTitle();
  }
}
