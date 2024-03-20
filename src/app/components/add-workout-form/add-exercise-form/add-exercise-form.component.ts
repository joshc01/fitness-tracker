import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Exercise } from '../../../types/exercise';
import { NgClass } from '@angular/common';
import { ExerciseName } from '../../../types/enums/exercise-name';
import { ExerciseFocus } from '../../../types/enums/exercise-focus';
import { Workout } from '../../../types/workout';

export type ExerciseData = {
    name: Exercise['name'] | null;
    focus: Exercise['focus'] | null;
    sets: Exercise['sets'] | null;
    reps: Exercise['reps'] | null;
    weight: Exercise['weight'] | null;
};

export type ExerciseDataFormGroup = {
    name: FormControl<ExerciseData['name']>;
    focus: FormControl<ExerciseData['focus']>;
    sets: FormControl<ExerciseData['sets']>;
    reps: FormControl<ExerciseData['reps']>;
    weight: FormControl<ExerciseData['weight']>;
};

@Component({
    selector: 'app-add-exercise-form',
    standalone: true,
    imports: [DropdownModule, InputNumberModule, ReactiveFormsModule, NgClass],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AddExerciseFormComponent), multi: true }],
    templateUrl: './add-exercise-form.component.html',
    styleUrl: './add-exercise-form.component.scss'
})
export class AddExerciseFormComponent implements ControlValueAccessor, OnInit, OnChanges {
    @Input()
    isSaveClicked = false;

    @Input()
    selectedWorkoutType!: Workout['type'];

    private onTouched = () => {};
    private onChanged = () => {};

    addExerciseFormGroup = new FormGroup<ExerciseDataFormGroup>({
        name: new FormControl<ExerciseData['name']>(null, { validators: Validators.required }),
        focus: new FormControl<ExerciseData['focus']>(null, { validators: Validators.required }),
        sets: new FormControl<ExerciseData['sets']>(null, { validators: Validators.required }),
        reps: new FormControl<ExerciseData['reps']>(null, { validators: Validators.required }),
        weight: new FormControl<ExerciseData['weight']>(null, { validators: Validators.required })
    });

    nameOptions = Object.values(ExerciseName).filter((val) => isNaN(Number(val)));
    focusOptions = Object.values(ExerciseFocus).filter((val) => isNaN(Number(val)));

    //TODO: Remove
    ngOnInit() {
        this.addExerciseFormGroup.valueChanges.subscribe((val) => console.log(val, this.isSaveClicked));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedWorkoutType'].currentValue) {
            this.addExerciseFormGroup.reset();
        }
    }

    registerOnChange(fn: typeof this.onTouched): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: typeof this.onChanged): void {
        this.onTouched = fn;
    }

    writeValue(exercise: ExerciseData): void {
        this.addExerciseFormGroup.patchValue(exercise);
    }
}
