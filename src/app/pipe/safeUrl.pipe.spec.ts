/* tslint:disable:no-unused-variable */


import { SafeUrlPipe } from './safeUrl.pipe';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';

describe('SafeUrlPipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });

  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SafeUrlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});
