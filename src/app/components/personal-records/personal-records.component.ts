import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExerciseName, ExerciseRecord, Workout, WorkoutType } from '../../types/workout';
import { Observable, Subject, takeUntil } from 'rxjs';
import { WorkoutDataService } from '../../services/workout-data.service';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { AsyncPipe, DatePipe, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { UnderscorePipe } from '../../pipes/underscore.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExerciseTimelineDialogComponent } from './exercise-timeline-dialog/exercise-timeline-dialog.component';

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
    upperBodyPRs!: ExerciseRecord[];
    lowerBodyPRs!: ExerciseRecord[];
    selectedExerciseRecord!: ExerciseRecord;

    private destroy$ = new Subject<void>();

    private workouts$!: Observable<Workout[]>;

    constructor(
        private dialogService: DialogService,
        private workoutDataService: WorkoutDataService
    ) {}

    ngOnInit() {
        this.workouts$ = this.workoutDataService.getAllWorkouts();
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

        const upperBodyExerciseRecords = this.getExerciseRecordsByWorkout(upperBodyWorkouts);
        const lowerBodyExerciseRecords = this.getExerciseRecordsByWorkout(lowerBodyWorkouts);

        this.upperBodyPRs = this.getSortedPersonalRecords(upperBodyExerciseRecords);
        this.lowerBodyPRs = this.getSortedPersonalRecords(lowerBodyExerciseRecords);
    }

    private getExerciseRecordsByWorkout(workouts: Workout[]): ExerciseRecord[] {
        return workouts.flatMap((workout): ExerciseRecord[] => {
            return workout.exercises.map((exercise) => {
                return {
                    ...exercise,
                    date: workout.date
                };
            });
        });
    }

    private getSortedPersonalRecords(records: ExerciseRecord[]) {
        const sortedRecords = records
            .sort((a, b) => a.name.localeCompare(b.name))
            .reduce(
                (prev, curr) => ({
                    ...prev,
                    [curr.name]: curr.weight > (prev[curr.name]?.weight ?? 0) ? curr : prev
                }),
                {} as Record<ExerciseName, ExerciseRecord>
            );

        return Object.values(sortedRecords);
    }

    openDialog(exerciseRecord: TableRowSelectEvent) {
        this.dialogRef = this.dialogService.open(ExerciseTimelineDialogComponent, {
            header: 'Timeline',
            modal: true,
            data: {
                currentExerciseName: exerciseRecord.data.name
            }
        });
    }
}
