import { TestBed } from '@angular/core/testing';

import { LogregService } from './logreg.service';

describe('LogregService', () => {
  let service: LogregService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogregService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
