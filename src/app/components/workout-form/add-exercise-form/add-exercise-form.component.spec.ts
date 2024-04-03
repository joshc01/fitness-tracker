import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExerciseFormComponent } from './add-exercise-form.component';

describe('AddExerciseFormComponent', () => {
    let component: AddExerciseFormComponent;
    let fixture: ComponentFixture<AddExerciseFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddExerciseFormComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AddExerciseFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
