import { TestBed, async, inject } from '@angular/core/testing';

import { PhoneGuard } from './phone.guard';

describe('PhoneGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhoneGuard]
    });
  });

  it('should ...', inject([PhoneGuard], (guard: PhoneGuard) => {
    expect(guard).toBeTruthy();
  }));
});
