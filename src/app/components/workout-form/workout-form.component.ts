import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { BehaviorSubject, combineLatest, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';
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
export class WorkoutFormComponent implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    protected readonly Mode = Mode;

    mode$!: Observable<Mode>;
    pastWorkouts$ = this._workoutDataService.workouts$;

    //Note: If 'null', that means workout does not exist yet for this date
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
        private _messageService: MessageService,
        private _workoutDataService: WorkoutDataService,
        private _workoutFormService: WorkoutFormService
    ) {
        this.mode$ = this._workoutFormService.getMode$();
    }

    ngOnInit() {
        //TODO: Combine all observables and handle one subscription?
        this.selectedWorkout$.pipe(takeUntil(this._destroy$)).subscribe();

        combineLatest([this.type.valueChanges, this.mode$])
            .pipe(takeUntil(this._destroy$))
            .subscribe(([typeString, mode]) => {
                this._updateExercisesOnTypeChange(mapStringToWorkoutType(typeString), mode);
            });

        this.date.valueChanges
            .pipe(
                startWith(this.date.value),
                switchMap((date) => this._workoutFormService.getExistingWorkoutByDate$(date))
            )
            .subscribe((workout) => {
                this._updateWorkoutOnDateChange(workout);
            });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _updateExercisesOnTypeChange(workoutType: WorkoutType, mode: Mode) {
        const selectedWorkout = this.selectedWorkout$.getValue();

        if (!selectedWorkout || (selectedWorkout && mode === Mode.UPDATE)) {
            this.exercises.clear();

            selectedWorkout?.type === workoutType
                ? selectedWorkout?.exercises.map((exercise) => this.addExercise(exercise))
                : this.addExercise();
        }
    }

    private _updateWorkoutOnDateChange(workout: Workout | null) {
        //TODO: Look into code duplication with cancelUpdate
        this._workoutFormService.setMode(Mode.ADD);
        this.selectedWorkout$.next(workout);
        this._resetTypeAndExercises();

        if (workout) {
            this.showUpdateIcon = true;
            this._showExistingWorkoutAndDisableForm();
        } else {
            this.showUpdateIcon = false;
            this._enableTypeAndExercises();
        }
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
            name: new FormControl<Exercise['name']>(exercise?.name ?? '', {
                validators: Validators.required,
                nonNullable: true
            }),
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
        this._workoutFormService.setMode(Mode.UPDATE);
        this.showUpdateIcon = false;
        this._enableTypeAndExercises();
    }

    cancelUpdatedWorkout(mode: Mode | null) {
        if (mode) {
            this._resetTypeAndExercises();

            if (mode === Mode.UPDATE) {
                this._exitUpdateMode();
                this._showExistingWorkoutAndDisableForm();
            }
        }
    }

    saveUpdatedWorkout() {
        this._workoutDataService.update(this._mapWorkoutDataToWorkout(this.workoutFormGroup.getRawValue()));
        this._showSuccessToast();
        this._exitUpdateMode();

        //TODO: Setting date to current value to fire observable to fetch existing workouts again. Only reset entire form on save/update?
        const date = this.selectedWorkout$.value?.date as Date;
        this.date.setValue(date);
        this._resetTypeAndExercises();
    }

    private _exitUpdateMode() {
        this._workoutFormService.setMode(Mode.ADD);
        this.showUpdateIcon = true;
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

    private _resetTypeAndExercises() {
        this.type.reset();
        this.exercises.clear();
    }

    private _disableTypeAndExercises() {
        this.type.disable({ emitEvent: false });
        this._workoutFormService.setDisableExercise(true);
    }

    private _enableTypeAndExercises() {
        this.type.enable({ emitEvent: false });
        this._workoutFormService.setDisableExercise(false);
    }
}
