import { ExerciseFocus } from '../../types/enums/exercise-focus';

export function mapExerciseFocusToString(exerciseFocus: ExerciseFocus): string {
    switch (exerciseFocus) {
        case ExerciseFocus.BACK:
            return 'Back';
        case ExerciseFocus.BICEPS:
            return 'Biceps';
        case ExerciseFocus.CALVES:
            return 'Calves';
        case ExerciseFocus.CHEST:
            return 'Chest';
        case ExerciseFocus.CORE:
            return 'Core';
        case ExerciseFocus.FOREARMS:
            return 'Forearms';
        case ExerciseFocus.GLUTES:
            return 'Glutes';
        case ExerciseFocus.HAMSTRINGS:
            return 'Hamstrings';
        case ExerciseFocus.QUADS:
            return 'Quads';
        case ExerciseFocus.SHOULDERS:
            return 'Shoulders';
        case ExerciseFocus.TRICEPS:
            return 'Triceps';
        default:
            return 'Invalid Exercise Focus';
    }
}

export function mapStringToExerciseFocus(stringValue: string): ExerciseFocus {
    switch (stringValue) {
        case 'Back':
            return ExerciseFocus.BACK;
        case 'Biceps':
            return ExerciseFocus.BICEPS;
        case 'Calves':
            return ExerciseFocus.CALVES;
        case 'Chest':
            return ExerciseFocus.CHEST;
        case 'Core':
            return ExerciseFocus.CORE;
        case 'Forearms':
            return ExerciseFocus.FOREARMS;
        case 'Glutes':
            return ExerciseFocus.GLUTES;
        case 'Hamstrings':
            return ExerciseFocus.HAMSTRINGS;
        case 'Quads':
            return ExerciseFocus.QUADS;
        case 'Shoulders':
            return ExerciseFocus.SHOULDERS;
        case 'Triceps':
            return ExerciseFocus.TRICEPS;
        //TODO: Change default value
        default:
            return ExerciseFocus.BACK;
    }
}
