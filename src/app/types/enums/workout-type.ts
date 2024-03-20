import { Exercise } from '../exercise';

export enum WorkoutType {
    UPPER_BODY = 'UPPER_BODY',
    LOWER_BODY = 'LOWER_BODY',
    FULL_BODY = 'FULL_BODY'
}

export type ExerciseByWorkoutTypeMap = Record<WorkoutType, Exercise[]>;
