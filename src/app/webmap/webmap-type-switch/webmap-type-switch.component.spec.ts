import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebmapTypeSwitchComponent } from './webmap-type-switch.component';

describe('WebmapTypeSwitchComponent', () => {
  let component: WebmapTypeSwitchComponent;
  let fixture: ComponentFixture<WebmapTypeSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebmapTypeSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebmapTypeSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
