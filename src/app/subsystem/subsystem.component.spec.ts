import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { SubsystemComponent } from './subsystem.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
//import { ViewportScroller } from '@angular/common';
//import { MethodsService } from '../methods.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

@Component({selector: 'app-header', template: ''})
class HeaderStubComponent {}

describe('SubsystemComponent', () => {
  let component: SubsystemComponent;
  let fixture: ComponentFixture<SubsystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubsystemComponent,
        HeaderStubComponent
      ],
      imports: [
        TranslateModule.forRoot(),  
        HttpClientModule,
        RouterTestingModule
      ]/*,
      providers: [
        MethodsService
      ]*/
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Mocks and spies
    TestBed.get(ActivatedRoute).params = of({
      "instance": "EE",
      "class": "CLASS",
      "member": "MEMBER",
      "subsystem": "SYSTEM"
    })
    //spyOn(TestBed.get(ViewportScroller), "scrollToPosition").and.callFake(() => {});

    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*afterEach(() => {
    TestBed.resetTestEnvironment()
  });*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('scrollToPosition was called', async(() => {
    expect(TestBed.get(ViewportScroller).scrollToPosition).toHaveBeenCalledWith([0, 0])
  }));*/
});
