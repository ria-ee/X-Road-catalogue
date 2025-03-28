import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { SubsystemsService } from '../../subsystems.service';
import { AppConfigMock } from '../../app.config-mock';
import { AppConfig } from '../../app.config';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let subsystemsService: SubsystemsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        SearchComponent
      ],
      providers: [
        { provide: AppConfig, useClass: AppConfigMock },
        provideHttpClient()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    subsystemsService = TestBed.inject(SubsystemsService);
    jest.spyOn(subsystemsService, 'getLimits').mockReturnValue({10: 10, 20: 20});
    jest.spyOn(subsystemsService, 'setNonEmpty').mockReturnValue(null);
    jest.spyOn(subsystemsService, 'setLimit').mockReturnValue(null);
    jest.spyOn(subsystemsService, 'setFilter').mockReturnValue(null);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getLimitKeys should work', () => {
    expect(component.getLimitKeys()).toEqual(['10', '20']);
    expect(subsystemsService.getLimits).toHaveBeenCalledWith();
  });

  it('setNonEmpty should work', () => {
    component.setNonEmpty(true);
    expect(subsystemsService.setNonEmpty).toHaveBeenCalledWith(true);
  });

  it('setLimit should work', () => {
    component.setLimit('50');
    expect(subsystemsService.setLimit).toHaveBeenCalledWith('50');
  });

  it('setFilter should work', () => {
    component.setFilter('test');
    expect(subsystemsService.setFilter).toHaveBeenCalledWith('test');
  });
});
