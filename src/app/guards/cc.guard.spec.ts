import { TestBed, async, inject } from '@angular/core/testing';

import { CcGuard } from './cc.guard';

describe('CcGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CcGuard]
    });
  });

  it('should ...', inject([CcGuard], (guard: CcGuard) => {
    expect(guard).toBeTruthy();
  }));
});
