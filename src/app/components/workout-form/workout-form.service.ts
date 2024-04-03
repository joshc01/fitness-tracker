import { Injectable } from '@angular/core';
import { WorkoutDataService } from '../../services/workout-data.service';
import { map, Observable } from 'rxjs';
import { Workout } from '../../types/workout';
import { mapDateToShortenedDate } from '../../mappers/shortened-date.mapper';

@Injectable({
    providedIn: 'root'
})
export class WorkoutFormService {
    private _existingWorkouts$ = this._workoutDataService.workouts$;

    constructor(private _workoutDataService: WorkoutDataService) {}

    getExistingWorkoutByDate(date: Date): Observable<Workout | null> {
        const shortenedDate = mapDateToShortenedDate(date);

        return this._existingWorkouts$.pipe(
            map(
                (workouts) =>
                    workouts.find(
                        (workout) =>
                            workout.date.getMonth() === shortenedDate.month &&
                            workout.date.getDate() === shortenedDate.day &&
                            workout.date.getFullYear() === shortenedDate.year
                    ) ?? null
            )
        );
    }
}
