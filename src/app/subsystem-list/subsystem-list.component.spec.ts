import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsystemListComponent } from './subsystem-list.component';

describe('SubsystemListComponent', () => {
  let component: SubsystemListComponent;
  let fixture: ComponentFixture<SubsystemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsystemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
