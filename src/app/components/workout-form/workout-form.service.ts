import { Injectable } from '@angular/core';
import { WorkoutDataService } from '../../services/workout-data.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Workout } from '../../types/workout';
import { mapDateToShortenedDate } from '../../mappers/shortened-date.mapper';
import { Mode } from '../../types/enums/mode';

@Injectable({
    providedIn: 'root'
})
export class WorkoutFormService {
    private _existingWorkouts$ = this._workoutDataService.workouts$;
    private _disableExercise$ = new BehaviorSubject<boolean>(false);

    //TODO: Mode might just live within parent component rather than the service (unless service should manage its state)
    private _mode = new BehaviorSubject<Mode>(Mode.ADD);

    constructor(private _workoutDataService: WorkoutDataService) {}

    getExistingWorkoutByDate$(date: Date): Observable<Workout | null> {
        const shortenedDate = mapDateToShortenedDate(date);

        return this._existingWorkouts$.pipe(
            map((workouts) => {
                return (
                    workouts.find(
                        (workout) =>
                            workout.date.getMonth() === shortenedDate.month &&
                            workout.date.getDate() === shortenedDate.day &&
                            workout.date.getFullYear() === shortenedDate.year
                    ) ?? null
                );
            })
        );
    }

    getDisableExercise$() {
        return this._disableExercise$.asObservable();
    }

    setDisableExercise(value: boolean) {
        this._disableExercise$.next(value);
    }
    getMode$() {
        return this._mode.asObservable();
    }

    setMode(mode: Mode) {
        this._mode.next(mode);
    }
}
