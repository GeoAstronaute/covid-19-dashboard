import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidRecapDataComponent } from './covid-recap-data.component';

describe('CovidRecapDataComponent', () => {
  let component: CovidRecapDataComponent;
  let fixture: ComponentFixture<CovidRecapDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidRecapDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidRecapDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
