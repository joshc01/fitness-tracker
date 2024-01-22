import { Injectable } from '@angular/core';
import { ExerciseFocus, ExerciseName, Workout, WorkoutType } from '../types/workout';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorkoutDataService {
    constructor() {}

    getAllWorkouts(): Observable<Workout[]> {
        const fakeWorkout: Workout = {
            type: WorkoutType.UPPER_BODY,
            exercises: [
                {
                    name: ExerciseName.CRUNCHES,
                    focus: ExerciseFocus.CORE,
                    sets: 3,
                    reps: 10,
                    weight: 0
                },
                {
                    name: ExerciseName.CALF_RAISES,
                    focus: ExerciseFocus.CALVES,
                    sets: 4,
                    reps: 12,
                    weight: 120
                }
            ],
            date: new Date()
        };

        const fakeData: Workout[] = [
            fakeWorkout,
            {
                ...fakeWorkout,
                date: new Date(2024, 0, 10)
            }
        ];

        return of(fakeData);
    }
}
