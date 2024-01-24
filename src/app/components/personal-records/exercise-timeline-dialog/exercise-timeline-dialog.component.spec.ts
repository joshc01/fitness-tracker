import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTimelineDialogComponent } from './exercise-timeline-dialog.component';

describe('ExerciseTimelineDialogComponent', () => {
    let component: ExerciseTimelineDialogComponent;
    let fixture: ComponentFixture<ExerciseTimelineDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExerciseTimelineDialogComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ExerciseTimelineDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
