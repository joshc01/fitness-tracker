import { Component, OnInit } from '@angular/core';
import { WorkoutDataService } from '../../../services/workout-data.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ExerciseName, ExerciseRecord, Workout } from '../../../types/workout';
import { ChartModule } from 'primeng/chart';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-exercise-timeline-dialog',
    standalone: true,
    imports: [ChartModule],
    templateUrl: './exercise-timeline-dialog.component.html',
    styleUrl: './exercise-timeline-dialog.component.scss'
})
export class ExerciseTimelineDialogComponent implements OnInit {
    currentExerciseName!: ExerciseName;
    chartData!: unknown;
    chartOptions!: unknown;

    private currentExerciseRecords!: ExerciseRecord[];
    private destroy$ = new Subject<void>();
    private workouts$!: Observable<Workout[]>;

    constructor(
        private workoutDataService: WorkoutDataService,
        private dialogConfig: DynamicDialogConfig
    ) {}

    ngOnInit() {
        this.currentExerciseName = this.dialogConfig.data.currentExerciseName;

        this.workouts$ = this.workoutDataService.getAllWorkouts();

        this.workouts$.pipe(takeUntil(this.destroy$)).subscribe((workouts) => {
            this.currentExerciseRecords = this.getSortedExerciseRecordsByName(workouts, this.currentExerciseName);
            this.chartData = this.getExerciseRecordsData(this.currentExerciseRecords);
        });

        this.chartOptions = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    }

    private getExerciseRecordsData(sortedExerciseRecords: ExerciseRecord[]): unknown {
        const labels = sortedExerciseRecords.map((record) => this.formatDate(record.date));
        const datasets = [
            {
                label: this.currentExerciseName,
                data: sortedExerciseRecords.map((record) => record.weight),
                fill: false,
                tension: 0.4
            }
        ];

        return {
            labels,
            datasets
        };
    }

    private formatDate(date: Date): string {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }

    private getSortedExerciseRecordsByName(workouts: Workout[], exerciseName: ExerciseName): ExerciseRecord[] {
        const allExerciseRecords = workouts.flatMap((workout) =>
            workout.exercises.map((exercise): ExerciseRecord => {
                return {
                    ...exercise,
                    date: workout.date
                };
            })
        );

        return allExerciseRecords
            .filter((exercise) => exercise.name === exerciseName)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}
