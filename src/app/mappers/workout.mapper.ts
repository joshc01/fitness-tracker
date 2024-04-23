import { WorkoutDO } from '../database/types/workout-DO';
import { Workout } from '../types/workout';
import { Timestamp } from 'firebase/firestore';

export function mapDOToWorkout(workoutDO: WorkoutDO): Workout {
    return {
        ...workoutDO,
        date: workoutDO.date.toDate()
    };
}

export function mapWorkoutToDO(workout: Workout): WorkoutDO {
    return {
        ...workout,
        date: Timestamp.fromDate(workout.date)
    };
}
