/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionControlService } from './session-control.service';

describe('Service: SessionControl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionControlService]
    });
  });

  it('should ...', inject([SessionControlService], (service: SessionControlService) => {
    expect(service).toBeTruthy();
  }));
});
