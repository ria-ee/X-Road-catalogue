import { Component, inject } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    imports: [NgClass]
})
export class HeaderComponent {
  private languagesService = inject(LanguagesService);


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
