import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutHistoryComponent } from './components/workout-history/workout-history.component';
import { PersonalRecordsComponent } from './components/personal-records/personal-records.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
    {
        path: 'fitness-tracker',
        children: [
            { path: 'home', component: HomePageComponent },
            { path: 'workout', component: WorkoutFormComponent },
            { path: 'workout-history', component: WorkoutHistoryComponent },
            { path: 'personal-records', component: PersonalRecordsComponent },
            { path: 'settings', component: SettingsComponent }
        ]
    },
    { path: '', redirectTo: 'fitness-tracker/home', pathMatch: 'full' }
];
