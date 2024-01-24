import { Injectable } from '@angular/core';
import { ExerciseFocus, ExerciseName, Workout, WorkoutType } from '../types/workout';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorkoutDataService {
    getAllWorkouts(): Observable<Workout[]> {
        const fakeData: Workout[] = [
            {
                type: WorkoutType.UPPER_BODY,
                exercises: [
                    {
                        name: ExerciseName.CRUNCHES,
                        focus: ExerciseFocus.CORE,
                        sets: 3,
                        reps: 10,
                        weight: 50
                    },
                    {
                        name: ExerciseName.CHEST_PRESS,
                        focus: ExerciseFocus.CHEST,
                        sets: 4,
                        reps: 12,
                        weight: 120
                    }
                ],
                date: new Date()
            },
            {
                type: WorkoutType.UPPER_BODY,
                exercises: [
                    {
                        name: ExerciseName.CRUNCHES,
                        focus: ExerciseFocus.CORE,
                        sets: 3,
                        reps: 15,
                        weight: 80
                    }
                ],
                date: new Date(2024, 0, 20)
            },
            {
                type: WorkoutType.LOWER_BODY,
                exercises: [
                    {
                        name: ExerciseName.CALF_RAISES,
                        focus: ExerciseFocus.CALVES,
                        sets: 5,
                        reps: 12,
                        weight: 0
                    }
                ],
                date: new Date(2024, 0, 10)
            },
            {
                type: WorkoutType.LOWER_BODY,
                exercises: [
                    {
                        name: ExerciseName.CALF_RAISES,
                        focus: ExerciseFocus.CALVES,
                        sets: 4,
                        reps: 8,
                        weight: 50
                    }
                ],
                date: new Date(2024, 0, 20)
            }
        ];

        return of(fakeData);
    }
}
