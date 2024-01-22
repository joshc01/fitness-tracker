import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutHistoryComponent } from './workout-history.component';

describe('WorkoutHistoryComponent', () => {
    let component: WorkoutHistoryComponent;
    let fixture: ComponentFixture<WorkoutHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WorkoutHistoryComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(WorkoutHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
