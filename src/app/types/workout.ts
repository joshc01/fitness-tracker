import { Exercise } from './exercise';
import { WorkoutType } from './enums/workout-type';

export type Workout = {
    id: string;
    date: Date;
    type: WorkoutType;
    exercises: Exercise[];
};
