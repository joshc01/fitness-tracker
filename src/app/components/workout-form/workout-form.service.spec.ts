import { TestBed } from '@angular/core/testing';

import { WorkoutFormService } from './workout-form.service';

describe('WorkoutFormService', () => {
    let service: WorkoutFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WorkoutFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
