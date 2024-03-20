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

// export function getExercisesByWorkoutType(workoutType: WorkoutType): Exercise[] {
//     switch (workoutType) {
//         case WorkoutType.UPPER_BODY:
//         case WorkoutType.LOWER_BODY:
//         case WorkoutType.FULL_BODY:
//         default:
//             return [];
//     }
// }
//
// export function getExerciseFocusByWorkoutType(workoutType: WorkoutType | null): ExerciseFocus[] {
//     const exerciseFocusGroups = Object.values(ExerciseFocus).filter((val) => isNaN(Number(val)));
//
//     switch (workoutType) {
//         case WorkoutType.UPPER_BODY:
//             return [
//                 ExerciseFocus.BACK,
//                 ExerciseFocus.BICEPS,
//                 ExerciseFocus.CHEST,
//                 ExerciseFocus.CORE,
//                 ExerciseFocus.FOREARMS,
//                 ExerciseFocus.SHOULDERS,
//                 ExerciseFocus.TRICEPS
//             ];
//         case WorkoutType.LOWER_BODY:
//             return [ExerciseFocus.CALVES, ExerciseFocus.GLUTES, ExerciseFocus.HAMSTRINGS, ExerciseFocus.QUADS];
//         case WorkoutType.FULL_BODY:
//         default:
//             return exerciseFocusGroups;
//     }
// }
