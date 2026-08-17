import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';
import { provideHttpClient } from '@angular/common/http';
import { LanguagesService } from '../languages.service';
import { AppConfigMock } from '../app.config-mock';
import { AppConfig } from '../app.config';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent
      ],
      providers: [
        provideTranslateService(),
        { provide: AppConfig, useClass: AppConfigMock },
        provideHttpClient()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set language', () => {
    const languagesService: LanguagesService = TestBed.inject(LanguagesService);
    vi.spyOn(languagesService, 'setLang').mockImplementation(() => { /* noop */ });
    component.setLang('xxx');
    expect(languagesService.setLang).toHaveBeenCalledWith('xxx');
  });
});
