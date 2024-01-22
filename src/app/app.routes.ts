import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AddWorkoutFormComponent } from './components/add-workout-form/add-workout-form.component';
import { WorkoutHistoryComponent } from './components/workout-history/workout-history.component';
import { PersonalRecordsComponent } from './components/personal-records/personal-records.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: 'add-workout', component: AddWorkoutFormComponent },
    { path: 'workout-history', component: WorkoutHistoryComponent },
    { path: 'personal-records', component: PersonalRecordsComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
