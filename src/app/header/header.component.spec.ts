import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';
import { provideHttpClient } from '@angular/common/http';
import { LanguagesService } from '../languages.service';
import { AppConfigMock } from '../app.config-mock';
import { AppConfig } from '../app.config';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HeaderComponent
      ],
      providers: [
        { provide: AppConfig, useClass: AppConfigMock },
        provideHttpClient()
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
    const languagesService: LanguagesService = TestBed.inject(LanguagesService);
    jest.spyOn(languagesService, 'setLang').mockReturnValue(null);
    component.setLang('xxx');
    expect(languagesService.setLang).toHaveBeenCalledWith('xxx');
  });
});
