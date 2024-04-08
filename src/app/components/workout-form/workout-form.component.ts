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
import { BehaviorSubject, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollTopModule } from 'primeng/scrolltop';
import { WorkoutFormService } from './workout-form.service';
import { Mode } from '../../types/enums/mode';
import { uid } from 'uid';
import { SpinnerModule } from 'primeng/spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StyledCalendarComponent } from '../styled-calendar/styled-calendar.component';

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
        ScrollTopModule,
        SpinnerModule,
        ProgressSpinnerModule,
        StyledCalendarComponent
    ],
    providers: [MessageService],
    templateUrl: './workout-form.component.html',
    styleUrl: './workout-form.component.scss'
})
export class WorkoutFormComponent implements OnInit {
    private _destroy$ = new Subject<void>();

    protected readonly Mode = Mode;

    mode: Mode = Mode.ADD;
    pastWorkouts$ = this._workoutDataService.workouts$;
    selectedWorkout$ = new BehaviorSubject<Workout | null>(null);
    showUpdateIcon = false;
    workoutFormGroup = new FormGroup({
        date: new FormControl<Date>(new Date(), {
            validators: Validators.required,
            nonNullable: true
        }),
        type: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        exercises: new FormArray<FormGroup<ExerciseFormControls>>([], { validators: Validators.required })
    });

    get date() {
        return this.workoutFormGroup.controls.date;
    }

    get type() {
        return this.workoutFormGroup.controls.type;
    }

    get exercises() {
        return this.workoutFormGroup.controls.exercises;
    }

    get workoutTypeOptions() {
        return Object.values(WorkoutType)
            .filter((type) => !isNaN(Number(type)))
            .map((workoutType) => mapWorkoutTypeToString(workoutType as WorkoutType));
    }

    constructor(
        private _workoutDataService: WorkoutDataService,
        private _messageService: MessageService,
        private _addWorkoutFormService: WorkoutFormService
    ) {}

    ngOnInit() {
        //TODO: Combine all observables and handle one subscription?
        this.selectedWorkout$.pipe(takeUntil(this._destroy$)).subscribe();

        this.type.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
            if (!this.selectedWorkout$.getValue() || (this.selectedWorkout$.getValue() && this.mode === Mode.UPDATE)) {
                this.exercises.clear();
                this.addExercise();
            }
        });

        this.date.valueChanges
            .pipe(
                startWith(this.date.value),
                switchMap((date) => this._addWorkoutFormService.getExistingWorkoutByDate$(date))
            )
            .subscribe((workout) => {
                this.selectedWorkout$.next(workout);
                this._resetTypeAndExercises();

                if (workout) {
                    this.showUpdateIcon = true;
                    this._showExistingWorkoutAndDisableForm();
                } else {
                    this.showUpdateIcon = false;
                    this._enableTypeAndExercises();
                }
            });
    }

    private _showExistingWorkoutAndDisableForm() {
        //Note: Typing it to 'Workout' because it's already known that this func is called if it exists
        const workout = this.selectedWorkout$.getValue() as Workout;
        workout.exercises.map((exercise) => this.addExercise(exercise));

        this.type.setValue(mapWorkoutTypeToString(workout.type));
        this._disableTypeAndExercises();
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

    saveNewWorkout() {
        this._workoutDataService.create(this._mapWorkoutDataToWorkout(this.workoutFormGroup.getRawValue()));
        this._showSuccessToast();
        this._resetTypeAndExercises();
    }

    deleteExercise(index: number) {
        this.exercises.removeAt(index);
    }

    enterUpdateMode() {
        this.showUpdateIcon = false;
        this.mode = Mode.UPDATE;
        this._enableTypeAndExercises();
    }

    cancelUpdatedWorkout() {
        this._exitUpdateMode();
        this._resetTypeAndExercises();
        this._showExistingWorkoutAndDisableForm();
    }

    saveUpdatedWorkout() {
        this._workoutDataService.update(this._mapWorkoutDataToWorkout(this.workoutFormGroup.getRawValue()));
        this._showSuccessToast();
        this._exitUpdateMode();

        //TODO: Currently resetting date to fire observable to fetch existing workouts. Only reset entire form on save/update?
        this.workoutFormGroup.reset();
    }

    private _showSuccessToast() {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Workout saved successfully.' });
    }

    //TODO: ID should be set outside of component?
    private _mapWorkoutDataToWorkout(workoutData: WorkoutData): Workout {
        return {
            //Note: Provide uid first if none is available. If one exists, it will take precedence
            id: this.selectedWorkout$.getValue()?.id || uid(16),
            ...workoutData,
            type: mapStringToWorkoutType(workoutData.type)
        };
    }

    private _exitUpdateMode() {
        this.showUpdateIcon = true;
        this.mode = Mode.ADD;
    }

    private _resetTypeAndExercises() {
        this.type.reset();
        this.exercises.clear();
    }

    private _disableTypeAndExercises() {
        this.type.disable({ emitEvent: false });
        this.exercises.disable({ emitEvent: false });
    }

    private _enableTypeAndExercises() {
        this.type.enable({ emitEvent: false });
        this.exercises.enable({ emitEvent: false });
    }
}
