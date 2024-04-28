import { TestBed } from '@angular/core/testing';

import { AuthForwardGuard } from './auth-forward.guard';

describe('AuthForwardGuard', () => {
  let guard: AuthForwardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthForwardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
