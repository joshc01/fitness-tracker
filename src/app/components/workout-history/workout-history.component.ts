import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workout } from '../../types/workout';
import { TreeTableModule } from 'primeng/treetable';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UnderscorePipe } from '../../pipes/underscore.pipe';
import { WorkoutDataService } from '../../services/workout-data.service';
import { mapWorkoutTypeToString } from '../../mappers/enum-string/workout-type.mapper';

type PrimeNGDate = {
    day: number;
    month: number;
    year: number;
    today?: boolean;
    selectable?: boolean;
};

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
        UnderscorePipe
    ],
    templateUrl: './workout-history.component.html',
    styleUrl: './workout-history.component.scss'
})
export class WorkoutHistoryComponent implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    currentWorkout$: Subject<Workout | null> = new Subject();
    dateFormControl = new FormControl<Date>(new Date());
    workouts$!: Observable<Workout[]>;
    allDateStrings: string[] = [];

    constructor(private workoutDataService: WorkoutDataService) {
        this.workouts$ = this.workoutDataService.workouts$;
    }

    ngOnInit() {
        //TODO: Look into not needing to manually set the currentWorkout for the initial Date. Look into NOT using combineLatest
        this.workouts$.pipe(take(1)).subscribe((workouts) => {
            const initialDateWorkout = this._getWorkoutsByDate(workouts, new Date());
            this.currentWorkout$.next(initialDateWorkout);

            this.allDateStrings = this._getAllDates(workouts).map((date) => this._getPrimeNGDateFromDate(date));
        });

        this._initDataTable();
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _initDataTable() {
        combineLatest([this.workouts$, this.dateFormControl.valueChanges])
            .pipe(
                tap(([workouts, selectedDate]) => {
                    const currentWorkout = selectedDate ? this._getWorkoutsByDate(workouts, selectedDate) : null;
                    this.currentWorkout$.next(currentWorkout);
                    console.log(workouts);
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

    private _getAllDates(workout: Workout[]): Date[] {
        return workout.map((workout) => workout.date);
    }

    private _getPrimeNGDateFromDate(date: Date): string {
        return date.getMonth().toString() + date.getDate().toString() + date.getFullYear().toString();
    }

    getPrimeNGDateFromCalendar(primeNGDate: PrimeNGDate): string {
        return primeNGDate.month.toString() + primeNGDate.day.toString() + primeNGDate.year.toString();
    }

    protected readonly mapWorkoutTypeToString = mapWorkoutTypeToString;
}
