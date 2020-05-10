import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidWebmapComponent } from './covid-webmap.component';

describe('CovidWebmapComponent', () => {
  let component: CovidWebmapComponent;
  let fixture: ComponentFixture<CovidWebmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidWebmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidWebmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
