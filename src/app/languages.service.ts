import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

const LANGUAGES = {
  'EST': 'est',
  'ENG': 'eng'
}

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private selectedLang = ''
  private translateSubscription: Subscription
  
  constructor(
    private translate: TranslateService,
    private title: Title
  ) {
    this.selectedLang = this.getDefaultLang()
    translate.setDefaultLang(LANGUAGES[this.selectedLang])
    this.updateTitle()
  }

  updateTitle(): void {
    // Not subscribing if subscription already in progress
    if (!this.translateSubscription || this.translateSubscription.closed) {
      this.translateSubscription = this.translate.get('index.title').subscribe((res: string) => {
        this.title.setTitle(res)
        this.translateSubscription.unsubscribe()
      });
    }
  }

  getDefaultLang(): string {
    if(window && window.localStorage && window.localStorage.getItem('lang')) {
      return window.localStorage.getItem('lang')
    }
    return Object.keys(LANGUAGES)[0]
  }

  getLang(): string {
    return this.selectedLang
  }

  getLangs(): string[] {
    return Object.keys(LANGUAGES)
  }

  setLang(lang: string): void {
    this.selectedLang = lang
    if(window && window.localStorage) {
      window.localStorage.setItem('lang', this.selectedLang)
    }
    this.translate.use(LANGUAGES[this.selectedLang]);
    this.updateTitle()
  }
}
