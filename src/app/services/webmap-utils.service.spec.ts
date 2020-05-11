import { TestBed } from '@angular/core/testing';

import { WebmapUtilsService } from './webmap-utils.service';

describe('WebmapUtilsService', () => {
  let service: WebmapUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebmapUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
