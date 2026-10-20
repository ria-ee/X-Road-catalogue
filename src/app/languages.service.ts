import { Injectable, inject } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private readonly translate = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly config = inject(AppConfig);

  private selectedLang = '';
  private translateSubscription!: Subscription;

  constructor() {
    this.selectedLang = this.getFallbackLang();
    const langCode = this.config.getConfig('LANGUAGES')[this.selectedLang];
    this.translate.setFallbackLang(langCode);
    this.translate.use(langCode).subscribe(() => this.updateTitle());
  }

  updateTitle(): void {
    // Not subscribing if subscription already in progress
    if (!this.translateSubscription || this.translateSubscription.closed) {
      this.translateSubscription = this.translate.get('index.title').pipe(take(1)).subscribe((res: string) => {
        this.title.setTitle(res);
      });
    }
  }

  getFallbackLang(): string {
    const storedLang = window?.localStorage?.getItem('lang');
    if (storedLang) {
      return storedLang;
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
