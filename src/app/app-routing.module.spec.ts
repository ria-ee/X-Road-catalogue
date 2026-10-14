import { TestBed } from '@angular/core/testing';
import { AppRoutingModule } from './app-routing.module';

describe('AppRoutingModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule
      ]
    });
  });

  it('should be created', () => {
    // Instantiating through DI, so that the generated module factory is used
    expect(TestBed.inject(AppRoutingModule)).toBeTruthy();
  });
});
