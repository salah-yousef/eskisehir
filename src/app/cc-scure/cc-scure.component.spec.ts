/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CcScureComponent } from './cc-scure.component';

describe('CcScureComponent', () => {
  let component: CcScureComponent;
  let fixture: ComponentFixture<CcScureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcScureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcScureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
