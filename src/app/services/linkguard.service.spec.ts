import { TestBed } from '@angular/core/testing';

import { LinkguardService } from './linkguard.service';

describe('LinkguardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinkguardService = TestBed.get(LinkguardService);
    expect(service).toBeTruthy();
  });
});
