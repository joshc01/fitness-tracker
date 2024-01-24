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

//TODO: Map enums to strings for display rather than using pipes in template

export enum WorkoutType {
    UPPER_BODY = 'UPPER_BODY',
    LOWER_BODY = 'LOWER_BODY'
}

export enum ExerciseName {
    CRUNCHES = 'CRUNCHES',
    CALF_RAISES = 'CALF_RAISES',
    CHEST_PRESS = 'CHEST_PRESS'
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

export type ExerciseRecord = Exercise & {
    date: Date;
};
