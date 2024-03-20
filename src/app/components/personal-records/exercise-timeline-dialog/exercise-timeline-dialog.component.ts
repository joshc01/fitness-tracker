import { Component, OnInit } from '@angular/core';
import { WorkoutDataService } from '../../../services/workout-data.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Workout } from '../../../types/workout';
import { ChartModule } from 'primeng/chart';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ExerciseLog } from '../../../types/exercise';
import { ExerciseName } from '../../../types/enums/exercise-name';

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

    private currentExerciseLogs!: ExerciseLog[];
    private destroy$ = new Subject<void>();
    private workouts$!: Observable<Workout[]>;

    constructor(
        private workoutDataService: WorkoutDataService,
        private dialogConfig: DynamicDialogConfig
    ) {}

    ngOnInit() {
        this.currentExerciseName = this.dialogConfig.data.currentExerciseName;

        this.workouts$ = this.workoutDataService.workouts$;

        this.workouts$.pipe(takeUntil(this.destroy$)).subscribe((workouts) => {
            this.currentExerciseLogs = this.getSortedExerciseLogsByName(workouts, this.currentExerciseName);
            this.chartData = this.getExerciseLogsData(this.currentExerciseLogs);
        });

        this.chartOptions = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    }

    private getExerciseLogsData(sortedExerciseLogs: ExerciseLog[]): unknown {
        const labels = sortedExerciseLogs.map((log) => this.formatDate(log.date));
        const datasets = [
            {
                label: this.currentExerciseName,
                data: sortedExerciseLogs.map((log) => log.weight),
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

    private getSortedExerciseLogsByName(workouts: Workout[], exerciseName: ExerciseName): ExerciseLog[] {
        const allExerciseLogs = workouts.flatMap((workout) =>
            workout.exercises.map((exercise): ExerciseLog => {
                return {
                    ...exercise,
                    date: workout.date
                };
            })
        );

        return allExerciseLogs
            .filter((exercise) => exercise.name === exerciseName)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}
