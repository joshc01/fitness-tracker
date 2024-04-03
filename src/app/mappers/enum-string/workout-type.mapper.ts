import { WorkoutType } from '../../types/enums/workout-type';
import { ExerciseFocus } from '../../types/enums/exercise-focus';
import { ExerciseName } from '../../types/enums/exercise-name';

export function mapWorkoutTypeToString(workoutType: WorkoutType): string {
    switch (workoutType) {
        case WorkoutType.FULL_BODY:
            return 'Full Body';
        case WorkoutType.LOWER_BODY:
            return 'Lower Body';
        case WorkoutType.UPPER_BODY:
            return 'Upper Body';
        default:
            return 'Invalid Workout Type';
    }
}

export function mapStringToWorkoutType(stringValue: string): WorkoutType {
    switch (stringValue) {
        case 'Full Body':
            return WorkoutType.FULL_BODY;
        case 'Lower Body':
            return WorkoutType.LOWER_BODY;
        case 'Upper Body':
            return WorkoutType.UPPER_BODY;
        //TODO: Change default value
        default:
            return WorkoutType.FULL_BODY;
    }
}

//TODO: Look into making a Record or Map for the mappers below

export function getExerciseNamesByWorkoutType(workoutType: WorkoutType): ExerciseName[] {
    switch (workoutType) {
        case WorkoutType.UPPER_BODY:
            return [
                ExerciseName.CRUNCHES,
                ExerciseName.CHEST_PRESS,
                ExerciseName.HAMMER_CURLS,
                ExerciseName.PREACHER_CURLS,
                ExerciseName.CROSS_BODY_CURLS,
                ExerciseName.OVERHEAD_TRICEP_EXTENSIONS,
                ExerciseName.REAR_DELT_PULL_DOWNS,
                ExerciseName.LAT_PULLDOWNS,
                ExerciseName.PUSH_UPS,
                ExerciseName.PULL_UPS,
                ExerciseName.CABLE_ROWS
            ];
        case WorkoutType.LOWER_BODY:
            return [
                ExerciseName.SQUATS,
                ExerciseName.HIP_THRUSTS,
                ExerciseName.GLUTE_BRIDGES,
                ExerciseName.DONKEY_KICKS,
                ExerciseName.ADDUCTORS,
                ExerciseName.ABDUCTORS,
                ExerciseName.LEG_EXTENSIONS,
                ExerciseName.HAMSTRING_CURLS,
                ExerciseName.RDLS
            ];
        case WorkoutType.FULL_BODY:
        default:
            return Object.values(ExerciseName).filter((name) => isNaN(Number(name)));
    }
}

export function getExerciseNamesByFocus(focus: ExerciseFocus): ExerciseName[] {
    switch (focus) {
        case ExerciseFocus.CHEST:
            return [ExerciseName.CHEST_PRESS, ExerciseName.PUSH_UPS];
        case ExerciseFocus.CORE:
            return [ExerciseName.CRUNCHES];
        case ExerciseFocus.CALVES:
            return [ExerciseName.CALF_RAISES];
        case ExerciseFocus.HAMSTRINGS:
            return [ExerciseName.SQUATS, ExerciseName.DONKEY_KICKS, ExerciseName.HAMSTRING_CURLS, ExerciseName.RDLS];
        case ExerciseFocus.GLUTES:
            return [
                ExerciseName.SQUATS,
                ExerciseName.DONKEY_KICKS,
                ExerciseName.RDLS,
                ExerciseName.HIP_THRUSTS,
                ExerciseName.GLUTE_BRIDGES
            ];
        case ExerciseFocus.QUADS:
            return [ExerciseName.LEG_EXTENSIONS, ExerciseName.ADDUCTORS];
        case ExerciseFocus.TRICEPS:
            return [ExerciseName.OVERHEAD_TRICEP_EXTENSIONS];
        case ExerciseFocus.SHOULDERS:
            return [ExerciseName.REAR_DELT_PULL_DOWNS];
        case ExerciseFocus.FOREARMS:
            return [];
        case ExerciseFocus.BICEPS:
            return [ExerciseName.HAMMER_CURLS, ExerciseName.PREACHER_CURLS, ExerciseName.CROSS_BODY_CURLS];
        case ExerciseFocus.BACK:
            return [ExerciseName.LAT_PULLDOWNS, ExerciseName.PULL_UPS];
        default:
            return Object.values(ExerciseName).filter((name) => isNaN(Number(name)));
    }
}

export function getExerciseFocusByWorkoutType(workoutType: WorkoutType): ExerciseFocus[] {
    switch (workoutType) {
        case WorkoutType.UPPER_BODY:
            return [
                ExerciseFocus.BACK,
                ExerciseFocus.BICEPS,
                ExerciseFocus.CHEST,
                ExerciseFocus.CORE,
                ExerciseFocus.FOREARMS,
                ExerciseFocus.SHOULDERS,
                ExerciseFocus.TRICEPS
            ];
        case WorkoutType.LOWER_BODY:
            return [ExerciseFocus.CALVES, ExerciseFocus.GLUTES, ExerciseFocus.HAMSTRINGS, ExerciseFocus.QUADS];
        case WorkoutType.FULL_BODY:
        default:
            return Object.values(ExerciseFocus).filter((focus) => isNaN(Number(focus)));
    }
}
