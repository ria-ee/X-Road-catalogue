import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { LanguagesService } from '../languages.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set language', () => {
    const languagesService: LanguagesService = TestBed.get(LanguagesService);
    spyOn(languagesService, 'setLang').and.returnValue(null);
    component.setLang('xxx');
    expect(languagesService.setLang).toHaveBeenCalledWith('xxx');
  });
});
