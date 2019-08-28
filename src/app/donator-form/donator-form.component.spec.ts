import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatorFormComponent } from './donator-form.component';

describe('DonatorFormComponent', () => {
  let component: DonatorFormComponent;
  let fixture: ComponentFixture<DonatorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonatorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
