import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { mapExerciseNameToString } from '../../../mappers/enum-string/exercise-name.mapper';
import { mapExerciseFocusToString, mapStringToExerciseFocus } from '../../../mappers/enum-string/exercise-focus.mapper';
import { Exercise } from '../../../types/exercise';
import {
    getExerciseFocusByWorkoutType,
    getExerciseNamesByFocus,
    getExerciseNamesByWorkoutType,
    mapStringToWorkoutType
} from '../../../mappers/enum-string/workout-type.mapper';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { WorkoutFormService } from '../workout-form.service';
import { ExerciseFocus } from '../../../types/enums/exercise-focus';

export type ExerciseFormControls = {
    name: FormControl<Exercise['name']>;
    focus: FormControl<Exercise['focus']>;
    sets: FormControl<Exercise['sets']>;
    reps: FormControl<Exercise['reps']>;
    weight: FormControl<Exercise['weight']>;
};

@Component({
    selector: 'app-add-exercise-form',
    standalone: true,
    imports: [DropdownModule, InputNumberModule, ReactiveFormsModule, NgClass, TooltipModule, NgIf, AsyncPipe],
    templateUrl: './add-exercise-form.component.html',
    styleUrl: './add-exercise-form.component.scss'
})
export class AddExerciseFormComponent implements OnInit, OnDestroy {
    @Input()
    exerciseFormGroup!: FormGroup<ExerciseFormControls>;

    @Input()
    selectedWorkoutType!: string;

    private _destroy$ = new Subject<void>();

    nameOptions!: string[];
    focusOptions!: string[];

    get nameControl() {
        return this.exerciseFormGroup.controls.name;
    }

    constructor(
        private _messageService: MessageService,
        private _workoutFormService: WorkoutFormService
    ) {}

    ngOnInit() {
        //TODO: Manually calling disable because passing in the control as disabled from the parent component does not have the control set as disabled behind the scenes
        this.nameControl.disable();

        this._setDropdownOptions();

        this.exerciseFormGroup.controls.focus.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this._destroy$))
            .subscribe((focusString) => {
                this._updateNameOptions(mapStringToExerciseFocus(focusString));

                //NOTE: Manually setting to empty string because calling reset() will result in the same exercise name if it already exists
                if (focusString) this.nameControl.disabled ? this.nameControl.enable() : this.nameControl.setValue('');
            });

        //TODO: Look into this firing before component is initialized
        this._workoutFormService
            .getDisableExercise$()
            .pipe(takeUntil(this._destroy$))
            .subscribe((disable) => {
                disable ? this.exerciseFormGroup.disable() : this._enableExerciseExceptName();
            });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _enableExerciseExceptName() {
        this.exerciseFormGroup.controls.focus.enable();
        this.exerciseFormGroup.controls.sets.enable();
        this.exerciseFormGroup.controls.reps.enable();
        this.exerciseFormGroup.controls.weight.enable();
    }

    showDisabledExerciseMessage() {
        if (this.exerciseFormGroup.controls.name.disabled) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Focus is missing',
                detail: 'Please select a Focus group before choosing an Exercise.'
            });
        }
    }

    private _setDropdownOptions() {
        const workoutType = mapStringToWorkoutType(this.selectedWorkoutType);

        this.focusOptions = getExerciseFocusByWorkoutType(workoutType).map((exerciseFocus) =>
            mapExerciseFocusToString(exerciseFocus)
        );
        this.nameOptions = getExerciseNamesByWorkoutType(workoutType).map((exerciseName) =>
            mapExerciseNameToString(exerciseName)
        );
    }

    private _updateNameOptions(focus: ExerciseFocus) {
        this.nameOptions = getExerciseNamesByFocus(focus).map((exerciseName) => mapExerciseNameToString(exerciseName));
    }
}
