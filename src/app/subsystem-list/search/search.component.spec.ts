import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { SubsystemsService } from 'src/app/subsystems.service';
import { AppConfigMock } from 'src/app/app.config-mock';
import { AppConfig } from 'src/app/app.config';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let subsystemsService: SubsystemsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        HttpClientModule
      ],
      providers: [
        { provide: AppConfig, useClass: AppConfigMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    subsystemsService = TestBed.inject(SubsystemsService);
    spyOn(subsystemsService, 'getLimits').and.returnValue({10: 10, 20: 20});
    spyOn(subsystemsService, 'setNonEmpty').and.returnValue(null);
    spyOn(subsystemsService, 'setLimit').and.returnValue(null);
    spyOn(subsystemsService, 'setFilter').and.returnValue(null);
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
