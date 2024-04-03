import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workout } from '../../types/workout';
import { Observable, Subject, takeUntil } from 'rxjs';
import { WorkoutDataService } from '../../services/workout-data.service';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { AsyncPipe, DatePipe, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { UnderscorePipe } from '../../pipes/underscore.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExerciseTimelineDialogComponent } from './exercise-timeline-dialog/exercise-timeline-dialog.component';
import { ExerciseLog } from '../../types/exercise';
import { ExerciseName } from '../../types/enums/exercise-name';
import { WorkoutType } from '../../types/enums/workout-type';
import { mapStringToExerciseName } from '../../mappers/enum-string/exercise-name.mapper';

@Component({
    selector: 'app-personal-records',
    standalone: true,
    imports: [FieldsetModule, TableModule, TitleCasePipe, UnderscorePipe, AsyncPipe, NgIf, NgTemplateOutlet, DatePipe],
    providers: [DialogService],
    templateUrl: './personal-records.component.html',
    styleUrl: './personal-records.component.scss'
})
export class PersonalRecordsComponent implements OnInit, OnDestroy {
    dialogRef!: DynamicDialogRef;

    upperBody = new Subject<ExerciseLog[]>();
    lowerBody = new Subject<ExerciseLog[]>();

    selectedExerciseRecord!: ExerciseLog;

    private _destroy$ = new Subject<void>();

    private _workouts$!: Observable<Workout[]>;

    constructor(
        private dialogService: DialogService,
        private workoutDataService: WorkoutDataService
    ) {}

    ngOnInit() {
        this._workouts$ = this.workoutDataService.workouts$;
        this._workouts$.pipe(takeUntil(this._destroy$)).subscribe((workouts) => {
            this._buildPRsMapsByWorkouts(workouts);
        });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _buildPRsMapsByWorkouts(workouts: Workout[]): void {
        const upperBodyWorkouts = workouts.filter((workout) => workout.type === WorkoutType.UPPER_BODY);
        const lowerBodyWorkouts = workouts.filter((workout) => workout.type === WorkoutType.LOWER_BODY);

        const upperBodyExerciseLogs = this._getExerciseLogsByWorkout(upperBodyWorkouts);
        const lowerBodyExerciseLogs = this._getExerciseLogsByWorkout(lowerBodyWorkouts);

        this.upperBody.next(this._getSortedPersonalRecords(upperBodyExerciseLogs));
        this.lowerBody.next(this._getSortedPersonalRecords(lowerBodyExerciseLogs));
    }

    private _getExerciseLogsByWorkout(workouts: Workout[]): ExerciseLog[] {
        return workouts.flatMap((workout): ExerciseLog[] => {
            return workout.exercises.map((exercise) => {
                return {
                    ...exercise,
                    date: workout.date
                };
            });
        });
    }

    //TODO: This is only sorted by weight. Add functionality to sort by other properties
    private _getSortedPersonalRecords(logs: ExerciseLog[]) {
        const sortedRecords = logs
            .sort((a, b) => a.name.localeCompare(b.name))
            .reduce(
                (prev, curr) => ({
                    ...prev,
                    [curr.name]: curr.weight > (prev[mapStringToExerciseName(curr.name)]?.weight ?? 0) ? curr : prev
                }),
                {} as Record<ExerciseName, ExerciseLog>
            );

        return Object.values(sortedRecords);
    }

    openDialog(exercisePR: TableRowSelectEvent) {
        this.dialogRef = this.dialogService.open(ExerciseTimelineDialogComponent, {
            header: 'Timeline',
            modal: true,
            data: {
                currentExerciseName: exercisePR.data.name
            }
        });
    }
}
