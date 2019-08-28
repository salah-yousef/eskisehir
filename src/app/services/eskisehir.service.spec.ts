import { TestBed } from '@angular/core/testing';

import { EskisehirService } from './eskisehir.service';

describe('EskisehirService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EskisehirService = TestBed.get(EskisehirService);
    expect(service).toBeTruthy();
  });
});
