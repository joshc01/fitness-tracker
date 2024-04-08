import { TestBed } from '@angular/core/testing';

import { WorkoutDataService } from './workout-data.service';

describe('WorkoutDataService', () => {
    let service: WorkoutDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WorkoutDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
