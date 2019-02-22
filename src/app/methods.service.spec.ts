import { TestBed } from '@angular/core/testing';

import { MethodsService } from './methods.service';

describe('MethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MethodsService = TestBed.get(MethodsService);
    expect(service).toBeTruthy();
  });
});
