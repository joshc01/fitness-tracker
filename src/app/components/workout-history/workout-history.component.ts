import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workout } from '../../types/workout';
import { TreeTableModule } from 'primeng/treetable';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subject, takeUntil, tap } from 'rxjs';
import { AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UnderscorePipe } from '../../pipes/underscore.pipe';
import { WorkoutDataService } from '../../services/workout-data.service';

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
    currentWorkout$ = new BehaviorSubject<Workout | null>(null);
    dateFormControl = new FormControl<Date>(new Date());
    workouts!: Observable<Workout[]>;

    private destroy$ = new Subject<void>();

    constructor(private workoutDataService: WorkoutDataService) {}

    ngOnInit() {
        this.initDataTable();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initDataTable() {
        this.workouts = this.workoutDataService.workouts$;

        combineLatest([this.workouts, this.dateFormControl.valueChanges])
            .pipe(
                tap(([workouts, selectedDate]) => {
                    console.log(workouts);
                    const currentWorkout = selectedDate ? this.getWorkoutByDate(workouts, selectedDate) : null;
                    this.currentWorkout$.next(currentWorkout);
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    //TODO: Learn how to handle dates with timestamps and UTC
    private getWorkoutByDate(workouts: Workout[], date: Date): Workout | null {
        const month = date.getMonth();
        const day = date.getDay();
        const year = date.getFullYear();

        const workout = workouts.find(
            (workout) =>
                workout.date.getMonth() === month &&
                workout.date.getDay() === day &&
                workout.date.getFullYear() === year
        );

        return workout ?? null;
    }
}
