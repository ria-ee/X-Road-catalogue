import { Component, OnInit } from '@angular/core';
import { LanguagesService } from '../languages.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private languagesService: LanguagesService) { }

  getLangs():string[] {
    return this.languagesService.getLangs()
  }

  getLang():string {
    return this.languagesService.getLang()
  }

  setLang(lang: string) {
    return this.languagesService.setLang(lang)
  }

  ngOnInit() {}
}
