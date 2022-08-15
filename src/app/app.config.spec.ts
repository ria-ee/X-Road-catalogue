import { AppConfig } from './app.config';
import { of } from 'rxjs';

describe('AppConfig', () => {
  let config: AppConfig;
  let httpClientSpy: { get: jest.SpyInstance };

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    };
    config = new AppConfig(httpClientSpy as any);
  });

  it('should be created', () => {
      expect(config).toBeTruthy();
  });

  it('should load configuration', async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    httpClientSpy.get.mockReturnValue(of({TEST: 'OK'}));
    await config.load();
    expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/config.json');
  });

  it('getConfig should work', async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    httpClientSpy.get.mockReturnValue(of({TEST: 'OK'}));
    await config.load();
    expect(config.getConfig('TEST')).toBe('OK');
  });
});
