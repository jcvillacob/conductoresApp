import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cedulaGuardGuard } from './cedula-guard.guard';

describe('cedulaGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cedulaGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
