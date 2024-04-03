import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Workout } from '../../types/workout';
import { CalendarModule } from 'primeng/calendar';
import { WorkoutDataService } from '../../services/workout-data.service';
import { AddExerciseFormComponent, ExerciseFormControls } from './add-exercise-form/add-exercise-form.component';
import { WorkoutType } from '../../types/enums/workout-type';
import { Exercise } from '../../types/exercise';
import { mapStringToWorkoutType, mapWorkoutTypeToString } from '../../mappers/enum-string/workout-type.mapper';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { startWith, Subject, take, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollTopModule } from 'primeng/scrolltop';
import { WorkoutFormService } from './workout-form.service';
import { Mode } from '../../types/enums/mode';
import { uid } from 'uid';

type WorkoutData = {
    date: Date;
    type: string;
    exercises: Exercise[];
};

@Component({
    selector: 'app-workout-form',
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
        NgForOf,
        RippleModule,
        ToastModule,
        TooltipModule,
        ScrollTopModule
    ],
    providers: [MessageService],
    templateUrl: './workout-form.component.html',
    styleUrl: './workout-form.component.scss'
})
export class WorkoutFormComponent implements OnInit {
    private _destroy$ = new Subject<void>();
    private existingWorkout!: Workout;

    protected readonly Mode = Mode;

    doesWorkoutExist = false;
    mode: Mode = Mode.ADD;
    showUpdateButton = false;
    workoutFormGroup = new FormGroup({
        date: new FormControl<Date>(new Date(), {
            validators: Validators.required,
            nonNullable: true
        }),
        type: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        exercises: new FormArray<FormGroup<ExerciseFormControls>>([], { validators: Validators.required })
    });
    workoutTypeOptions = Object.values(WorkoutType)
        .filter((type) => !isNaN(Number(type)))
        .map((workoutType) => mapWorkoutTypeToString(workoutType as WorkoutType));

    get date() {
        return this.workoutFormGroup.controls.date;
    }

    get type() {
        return this.workoutFormGroup.controls.type;
    }

    get exercises() {
        return this.workoutFormGroup.controls.exercises;
    }

    constructor(
        private _workoutDataService: WorkoutDataService,
        private _messageService: MessageService,
        private _addWorkoutFormService: WorkoutFormService
    ) {}

    ngOnInit() {
        //TODO: Code duplication with _resetWorkoutForm()
        this.type.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
            if (!this.doesWorkoutExist) {
                this.exercises.clear();
                // this.addExercise();
            }
        });

        //TODO: Use operator instead of nested subscriptions
        this.date.valueChanges.pipe(startWith(this.date.value), takeUntil(this._destroy$)).subscribe((date) => {
            this._addWorkoutFormService
                .getExistingWorkoutByDate(date)
                .pipe(take(1))
                .subscribe((workout) => {
                    this._resetTypeAndExercises();

                    if (workout) {
                        this.doesWorkoutExist = true;
                        this.showUpdateButton = true;
                        this._showExistingWorkoutAndDisableForm(workout);
                    } else {
                        this.doesWorkoutExist = false;
                        this.showUpdateButton = false;
                        this._enableWorkoutForm();
                    }
                });
        });
    }

    private _showExistingWorkoutAndDisableForm(workout: Workout) {
        this.existingWorkout = workout;
        this.existingWorkout.exercises.map((exercise) => this.addExercise(exercise));
        this.type.setValue(mapWorkoutTypeToString(workout.type));
        this._disableWorkoutForm();
    }

    addExercise(exercise?: Exercise) {
        const addExerciseFormGroup = new FormGroup<ExerciseFormControls>({
            focus: new FormControl<Exercise['focus']>(exercise?.focus ?? '', {
                validators: Validators.required,
                nonNullable: true
            }),
            name: new FormControl<Exercise['name']>(
                { value: exercise?.name ?? '', disabled: true },
                { validators: Validators.required, nonNullable: true }
            ),
            sets: new FormControl<Exercise['sets']>(exercise?.sets ?? 1, {
                validators: Validators.required,
                nonNullable: true
            }),
            reps: new FormControl<Exercise['reps']>(exercise?.reps ?? 1, {
                validators: Validators.required,
                nonNullable: true
            }),
            weight: new FormControl<Exercise['weight']>(exercise?.weight ?? 0, {
                validators: Validators.required,
                nonNullable: true
            })
        });

        this.exercises.push(addExerciseFormGroup);
    }

    saveWorkout() {
        this._showSuccessToast();
        this._workoutDataService.create(this._mapWorkoutDataToWorkout(this.workoutFormGroup.getRawValue()));
        this._resetTypeAndExercises();
    }

    deleteExercise(index: number) {
        this.exercises.removeAt(index);
    }

    updateWorkout() {
        this.showUpdateButton = false;
        this.mode = Mode.UPDATE;
        this._enableWorkoutForm();
    }

    cancelUpdatedWorkout() {
        this._closeUpdateMode();
        this._showExistingWorkoutAndDisableForm(this.existingWorkout);
    }

    saveUpdatedWorkout() {
        this._closeUpdateMode();
        this.saveWorkout();
    }

    private _showSuccessToast() {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Workout saved successfully.' });
    }

    //TODO: ID should be added outside of component
    private _mapWorkoutDataToWorkout(workoutData: WorkoutData): Workout {
        return {
            //Note: Provide uid first if none is available. If one exists, it will take precedence
            id: uid(16),
            ...workoutData,
            type: mapStringToWorkoutType(workoutData.type)
        };
    }

    private _resetTypeAndExercises() {
        this.type.reset();
        this.exercises.clear();
    }

    private _closeUpdateMode() {
        this.showUpdateButton = true;
        this.mode = Mode.ADD;
        this._resetTypeAndExercises();
    }

    private _disableWorkoutForm() {
        this.type.disable();
        this.exercises.disable();
    }

    private _enableWorkoutForm() {
        this.type.enable();
        this.exercises.enable();
    }
}
