import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app.config';
import { of } from 'rxjs';
import { Config } from './config';
import { TestBed } from '@angular/core/testing';

describe('AppConfig', () => {
  let config: AppConfig;
  let httpClientSpy: { get: jest.SpyInstance };

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    };
    TestBed.configureTestingModule({
      providers: [
        AppConfig,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    config = TestBed.inject(AppConfig);
  });

  it('should be created', () => {
      expect(config).toBeTruthy();
  });

  it('should load configuration', async () => {
    const mockResponse = new Config();
    mockResponse.API_SERVICE = 'index.json';
    httpClientSpy.get.mockReturnValue(of(mockResponse));
    await config.load();
    expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/config.json');
  });

  it('getConfig should work', async () => {
    httpClientSpy.get.mockReturnValue(of({API_SERVICE: 'index.json'}));
    await config.load();
    expect(config.getConfig('API_SERVICE')).toBe('index.json');
  });
});
