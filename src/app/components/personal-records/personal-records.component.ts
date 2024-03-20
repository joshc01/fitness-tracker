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

    private destroy$ = new Subject<void>();

    private workouts$!: Observable<Workout[]>;

    constructor(
        private dialogService: DialogService,
        private workoutDataService: WorkoutDataService
    ) {}

    ngOnInit() {
        this.workouts$ = this.workoutDataService.workouts$;
        this.workouts$.pipe(takeUntil(this.destroy$)).subscribe((workouts) => {
            this.buildPRsMapsByWorkouts(workouts);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private buildPRsMapsByWorkouts(workouts: Workout[]): void {
        const upperBodyWorkouts = workouts.filter((workout) => workout.type === WorkoutType.UPPER_BODY);
        const lowerBodyWorkouts = workouts.filter((workout) => workout.type === WorkoutType.LOWER_BODY);

        const upperBodyExerciseLogs = this.getExerciseLogsByWorkout(upperBodyWorkouts);
        const lowerBodyExerciseLogs = this.getExerciseLogsByWorkout(lowerBodyWorkouts);

        this.upperBody.next(this.getSortedPersonalRecords(upperBodyExerciseLogs));
        this.lowerBody.next(this.getSortedPersonalRecords(lowerBodyExerciseLogs));
    }

    private getExerciseLogsByWorkout(workouts: Workout[]): ExerciseLog[] {
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
    private getSortedPersonalRecords(logs: ExerciseLog[]) {
        const sortedRecords = logs
            .sort((a, b) => a.name.localeCompare(b.name))
            .reduce(
                (prev, curr) => ({
                    ...prev,
                    [curr.name]: curr.weight > (prev[curr.name]?.weight ?? 0) ? curr : prev
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
