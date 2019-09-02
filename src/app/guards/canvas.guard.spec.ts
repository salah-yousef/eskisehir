import { TestBed, async, inject } from '@angular/core/testing';

import { CanvasGuard } from './canvas.guard';

describe('CanvasGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasGuard]
    });
  });

  it('should ...', inject([CanvasGuard], (guard: CanvasGuard) => {
    expect(guard).toBeTruthy();
  }));
});
