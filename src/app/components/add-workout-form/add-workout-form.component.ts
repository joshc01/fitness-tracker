import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Workout } from '../../types/workout';
import { CalendarModule } from 'primeng/calendar';
import { WorkoutDataService } from '../../services/workout-data.service';
import { AddExerciseFormComponent } from './add-exercise-form/add-exercise-form.component';
import { WorkoutType } from '../../types/enums/workout-type';
import { uid } from 'uid';
import { Exercise } from '../../types/exercise';

export type WorkoutData = {
    date: Workout['date'];
    type: Workout['type'] | null;
    exercises: Workout['exercises'];
};
@Component({
    selector: 'app-add-workout-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        NgClass,
        DropdownModule,
        CalendarModule,
        AddExerciseFormComponent,
        NgIf,
        AsyncPipe,
        NgForOf
    ],
    templateUrl: './add-workout-form.component.html',
    styleUrl: './add-workout-form.component.scss'
})
export class AddWorkoutFormComponent {
    //TODO: Fix 'exercises' FormArray to work with add-exercise-form CVA
    addWorkoutFormGroup = new FormGroup({
        date: new FormControl<WorkoutData['date']>(new Date(), {
            validators: Validators.required,
            nonNullable: true
        }),
        type: new FormControl<WorkoutData['type']>(null, { validators: Validators.required }),
        exercises: new FormArray<FormControl<Exercise>>([], { validators: Validators.required })
    });

    workoutTypeOptions = Object.values(WorkoutType).filter((val) => isNaN(Number(val)));
    isSaveClicked = false;

    constructor(private workoutDataService: WorkoutDataService) {}

    addExercise() {
        this.addWorkoutFormGroup.controls.exercises.push(new FormControl());
    }

    deleteExercise(index: number) {
        this.addWorkoutFormGroup.controls.exercises.removeAt(index);
    }

    saveWorkout() {
        this.isSaveClicked = true;
        console.log(this.addWorkoutFormGroup.valid, this.addWorkoutFormGroup.getRawValue());

        if (this.addWorkoutFormGroup.valid) {
            console.log('save clicked', this.getWorkoutFromFormGroup(this.addWorkoutFormGroup.getRawValue()));
            // this.workoutDataService.create(this.getWorkoutFromFormGroup(this.addWorkoutFormGroup.getRawValue()));
        }
    }

    //TODO: ID should be added outside of component
    private getWorkoutFromFormGroup(workoutData: WorkoutData): Workout {
        return {
            id: uid(16),
            date: workoutData.date,
            type: workoutData.type,
            exercises: workoutData.exercises
        } as Workout;
    }
}
