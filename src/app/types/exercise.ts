export type Exercise = {
    name: string;
    focus: string;
    sets: number;
    reps: number;
    weight: number;
};

export type ExerciseLog = Exercise & {
    date: Date;
};
