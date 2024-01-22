import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Exercise, ExerciseName, Workout, WorkoutType } from '../../types/workout';
import { CalendarModule } from 'primeng/calendar';

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
        CalendarModule
    ],
    templateUrl: './add-workout-form.component.html',
    styleUrl: './add-workout-form.component.scss'
})
export class AddWorkoutFormComponent {
    addWorkoutFormGroup = new FormGroup({
        date: new FormControl<Workout['date'] | null>(null),
        workoutType: new FormControl<Workout['type'] | null>(null),
        exercise: new FormControl<Exercise['name'] | null>(null),
        sets: new FormControl<Exercise['sets'] | null>(null),
        reps: new FormControl<Exercise['reps'] | null>(null)
    });

    exerciseOptions = [ExerciseName.CRUNCHES];
    workoutTypeOptions = [WorkoutType.UPPER_BODY, WorkoutType.LOWER_BODY];

    saveWorkout() {
        console.log(this.addWorkoutFormGroup.getRawValue());
    }
}
