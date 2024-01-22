export type Workout = {
    date: Date;
    type: WorkoutType;
    exercises: Exercise[];
};

export type Exercise = {
    name: ExerciseName;
    focus: ExerciseFocus;
    sets: number;
    reps: number;
    weight: number;
};

export enum WorkoutType {
    UPPER_BODY = 'UPPER_BODY',
    LOWER_BODY = 'LOWER_BODY'
}

export enum ExerciseName {
    CRUNCHES = 'CRUNCHES',
    CALF_RAISES = 'CALF_RAISES'
}

export enum ExerciseFocus {
    BACK = 'BACK',
    BICEPS = 'BICEPS',
    CALVES = 'CALVES',
    CHEST = 'CHEST',
    CORE = 'CORE',
    FOREARMS = 'FOREARMS',
    GLUTES = 'GLUTES',
    HAMSTRINGS = 'HAMSTRINGS',
    QUADS = 'QUADS',
    SHOULDERS = 'SHOULDERS',
    TRICEPS = 'TRICEPS'
}
