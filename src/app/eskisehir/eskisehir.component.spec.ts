import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EskisehirComponent } from './eskisehir.component';

describe('EskisehirComponent', () => {
  let component: EskisehirComponent;
  let fixture: ComponentFixture<EskisehirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EskisehirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EskisehirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
