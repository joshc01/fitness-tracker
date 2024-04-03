import { ExerciseName } from '../../types/enums/exercise-name';

export function mapExerciseNameToString(exerciseName: ExerciseName): string {
    switch (exerciseName) {
        case ExerciseName.ABDUCTORS:
            return 'Abductors';
        case ExerciseName.ADDUCTORS:
            return 'Adductors';
        case ExerciseName.CABLE_ROWS:
            return 'Cable Rows';
        case ExerciseName.CALF_RAISES:
            return 'Calf Raises';
        case ExerciseName.CHEST_PRESS:
            return 'Chest Press';
        case ExerciseName.CROSS_BODY_CURLS:
            return 'Cross-Body Curls';
        case ExerciseName.CRUNCHES:
            return 'Crunches';
        case ExerciseName.DONKEY_KICKS:
            return 'Donkey Kicks';
        case ExerciseName.GLUTE_BRIDGES:
            return 'Glute Bridges';
        case ExerciseName.HAMMER_CURLS:
            return 'Hammer Curls';
        case ExerciseName.HAMSTRING_CURLS:
            return 'Hamstring Curls';
        case ExerciseName.HIP_THRUSTS:
            return 'Hip Thrusts';
        case ExerciseName.LAT_PULLDOWNS:
            return 'Lat Pull-Downs';
        case ExerciseName.LEG_EXTENSIONS:
            return 'Leg Extensions';
        case ExerciseName.OVERHEAD_TRICEP_EXTENSIONS:
            return 'Overhead Tricep Extensions';
        case ExerciseName.PREACHER_CURLS:
            return 'Preacher Curls';
        case ExerciseName.PULL_UPS:
            return 'Pull-Ups';
        case ExerciseName.PUSH_UPS:
            return 'Push-Ups';
        case ExerciseName.RDLS:
            return 'RDLs';
        case ExerciseName.REAR_DELT_PULL_DOWNS:
            return 'Rear Delt Pull-Downs';
        case ExerciseName.SQUATS:
            return 'Squats';
        default:
            return 'Invalid Exercise name';
    }
}

export function mapStringToExerciseName(stringValue: string): ExerciseName {
    switch (stringValue) {
        case 'Abductors':
            return ExerciseName.ABDUCTORS;
        case 'Adductors':
            return ExerciseName.ADDUCTORS;
        case 'Cable Rows':
            return ExerciseName.CABLE_ROWS;
        case 'Calf Raises':
            return ExerciseName.CALF_RAISES;
        case 'Chest Press':
            return ExerciseName.CHEST_PRESS;
        case 'Cross-Body Curls':
            return ExerciseName.CROSS_BODY_CURLS;
        case 'Crunches':
            return ExerciseName.CRUNCHES;
        case 'Donkey Kicks':
            return ExerciseName.DONKEY_KICKS;
        case 'Glute Bridges':
            return ExerciseName.GLUTE_BRIDGES;
        case 'Hammer Curls':
            return ExerciseName.HAMMER_CURLS;
        case 'Hamstring Curls':
            return ExerciseName.HAMSTRING_CURLS;
        case 'Hip Thrusts':
            return ExerciseName.HIP_THRUSTS;
        case 'Lat Pull-Downs':
            return ExerciseName.LAT_PULLDOWNS;
        case 'Leg Extensions':
            return ExerciseName.LEG_EXTENSIONS;
        case 'Overhead Tricep Extensions':
            return ExerciseName.OVERHEAD_TRICEP_EXTENSIONS;
        case 'Preacher Curls':
            return ExerciseName.PREACHER_CURLS;
        case 'Pull-Ups':
            return ExerciseName.PULL_UPS;
        case 'Push-Ups':
            return ExerciseName.PUSH_UPS;
        case 'RDLs':
            return ExerciseName.RDLS;
        case 'Rear Delt Pull-Downs':
            return ExerciseName.REAR_DELT_PULL_DOWNS;
        case 'Squats':
            return ExerciseName.SQUATS;
        default:
            return ExerciseName.CRUNCHES;
    }
}
