import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentredMessageComponent } from './centred-message.component';

describe('CentredMessageComponent', () => {
  let component: CentredMessageComponent;
  let fixture: ComponentFixture<CentredMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentredMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentredMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
