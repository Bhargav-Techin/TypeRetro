import { TestBed } from '@angular/core/testing';

import { GeminiModelService } from './gemini-model.service';

describe('GeminiModelService', () => {
  let service: GeminiModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
