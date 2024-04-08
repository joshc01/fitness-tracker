import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { mapExerciseNameToString } from '../../../mappers/enum-string/exercise-name.mapper';
import { mapExerciseFocusToString, mapStringToExerciseFocus } from '../../../mappers/enum-string/exercise-focus.mapper';
import { Exercise } from '../../../types/exercise';
import {
    getExerciseFocusByWorkoutType,
    getExerciseNamesByFocus,
    getExerciseNamesByWorkoutType,
    mapStringToWorkoutType
} from '../../../mappers/enum-string/workout-type.mapper';
import { Subject, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

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
    imports: [DropdownModule, InputNumberModule, ReactiveFormsModule, NgClass, TooltipModule, NgIf],
    templateUrl: './add-exercise-form.component.html',
    styleUrl: './add-exercise-form.component.scss'
})
export class AddExerciseFormComponent implements OnInit, OnChanges {
    @Input()
    exerciseFormGroup!: FormGroup<ExerciseFormControls>;

    @Input()
    selectedWorkoutType!: string;

    private _destroy$ = new Subject<void>();

    nameOptions!: string[];
    focusOptions!: string[];

    constructor(private _messageService: MessageService) {}

    ngOnInit() {
        this._setDropdownOptions();

        this.exerciseFormGroup.controls.focus.valueChanges
            .pipe(takeUntil(this._destroy$))
            .subscribe((focusString) => this._updateNameBySelectedFocus(focusString));
    }

    ngOnChanges(changes: SimpleChanges) {
        //TODO: Look into using '?'
        if (changes['selectedWorkoutType']?.currentValue) {
            this.exerciseFormGroup.reset();
        }
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

    private _updateNameBySelectedFocus(focusString: string) {
        const exerciseFocus = mapStringToExerciseFocus(focusString);
        const nameControl = this.exerciseFormGroup.controls.name;

        nameControl.disabled ? nameControl.enable() : nameControl.reset();

        this.nameOptions = getExerciseNamesByFocus(exerciseFocus).map((exerciseName) =>
            mapExerciseNameToString(exerciseName)
        );
    }
}
