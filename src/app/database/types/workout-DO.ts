import { Timestamp } from 'firebase/firestore';
import { Exercise } from '../../types/exercise';

export type WorkoutDO = {
    id: string;
    date: Timestamp;
    type: number;
    exercises: Exercise[];
};
