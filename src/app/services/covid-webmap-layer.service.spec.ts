import { TestBed } from '@angular/core/testing';

import { CovidWebmapLayerService } from './covid-webmap-layer.service';

describe('CovidWebmapLayerService', () => {
  let service: CovidWebmapLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidWebmapLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
