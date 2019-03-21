import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { SubsystemsService } from 'src/app/subsystems.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let subsystemsService: SubsystemsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    subsystemsService = TestBed.get(SubsystemsService);
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
