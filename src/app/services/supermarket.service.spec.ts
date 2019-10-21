import { TestBed } from '@angular/core/testing';

import { SupermarketService } from './supermarket.service';

describe('SupermarketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupermarketService = TestBed.get(SupermarketService);
    expect(service).toBeTruthy();
  });
});
