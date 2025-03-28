import { Component } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    imports: [NgFor, NgClass]
})
export class HeaderComponent {

  constructor(private languagesService: LanguagesService) { }

  getLangs(): string[] {
    return this.languagesService.getLangs();
  }

  getLang(): string {
    return this.languagesService.getLang();
  }

  setLang(lang: string) {
    return this.languagesService.setLang(lang);
  }
}
