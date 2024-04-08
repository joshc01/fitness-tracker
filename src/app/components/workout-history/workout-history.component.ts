import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workout } from '../../types/workout';
import { TreeTableModule } from 'primeng/treetable';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, Subject, take, takeUntil, tap } from 'rxjs';
import { AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UnderscorePipe } from '../../pipes/underscore.pipe';
import { WorkoutDataService } from '../../services/workout-data.service';
import { StyledCalendarComponent } from '../styled-calendar/styled-calendar.component';
import { mapWorkoutTypeToString } from '../../mappers/enum-string/workout-type.mapper';

@Component({
    selector: 'app-workout-history',
    standalone: true,
    imports: [
        TreeTableModule,
        CalendarModule,
        ReactiveFormsModule,
        NgForOf,
        NgIf,
        AsyncPipe,
        NgStyle,
        TableModule,
        DatePipe,
        TitleCasePipe,
        UnderscorePipe,
        StyledCalendarComponent
    ],
    templateUrl: './workout-history.component.html',
    styleUrl: './workout-history.component.scss'
})
export class WorkoutHistoryComponent implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    protected readonly mapWorkoutTypeToString = mapWorkoutTypeToString;

    currentWorkout$: Subject<Workout | null> = new Subject();
    dateFormControl = new FormControl<Date>(new Date(), { validators: Validators.required, nonNullable: true });
    pastWorkouts$ = this.workoutDataService.workouts$;

    constructor(private workoutDataService: WorkoutDataService) {}

    ngOnInit() {
        //TODO: Look into not needing to manually set the currentWorkout for the initial Date. Look into NOT using combineLatest
        this.pastWorkouts$.pipe(take(1)).subscribe((workouts) => {
            const initialDateWorkout = this._getWorkoutsByDate(workouts, new Date());
            this.currentWorkout$.next(initialDateWorkout);
        });

        this._initDataTable();
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _initDataTable() {
        combineLatest([this.pastWorkouts$, this.dateFormControl.valueChanges])
            .pipe(
                tap(([workouts, selectedDate]) => {
                    const currentWorkout = selectedDate ? this._getWorkoutsByDate(workouts, selectedDate) : null;
                    this.currentWorkout$.next(currentWorkout);
                }),
                takeUntil(this._destroy$)
            )
            .subscribe();
    }

    //TODO: Learn how to handle dates with timestamps and UTC
    private _getWorkoutsByDate(workouts: Workout[], date: Date): Workout | null {
        const month = date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();

        const workout = workouts.find(
            (workout) =>
                workout.date.getMonth() === month &&
                workout.date.getDate() === day &&
                workout.date.getFullYear() === year
        );

        return workout ?? null;
    }
}
