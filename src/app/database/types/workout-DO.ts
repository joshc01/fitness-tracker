import { Exercise } from '../../types/exercise';
import { Timestamp } from 'firebase/firestore';
import { WorkoutType } from '../../types/enums/workout-type';

export type WorkoutDO = {
    id: string;
    date: Timestamp;
    type: WorkoutType;
    exercises: Exercise[];
};
