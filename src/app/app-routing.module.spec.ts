import { AppRoutingModule } from './app-routing.module';

describe('AppModule', () => {
  let module: AppRoutingModule;

  beforeEach(() => {
    module = new AppRoutingModule();
  });

  it('should be created', () => {
    expect(module).toBeTruthy();
  });
});
