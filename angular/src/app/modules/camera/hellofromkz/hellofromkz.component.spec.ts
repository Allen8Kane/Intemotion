import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HellofromkzComponent } from './hellofromkz.component';

describe('HellofromkzComponent', () => {
  let component: HellofromkzComponent;
  let fixture: ComponentFixture<HellofromkzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HellofromkzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HellofromkzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
