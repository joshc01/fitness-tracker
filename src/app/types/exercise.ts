import { ExerciseName } from './enums/exercise-name';
import { ExerciseFocus } from './enums/exercise-focus';

export type Exercise = {
    name: ExerciseName;
    focus: ExerciseFocus;
    sets: number;
    reps: number;
    weight: number;
};

export type ExerciseLog = Exercise & {
    date: Date;
};
