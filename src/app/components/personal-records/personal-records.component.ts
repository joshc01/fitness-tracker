import { Component, OnInit } from '@angular/core';
import { Workout } from '../../types/workout';
import { Observable } from 'rxjs';
import { WorkoutDataService } from '../../services/workout-data.service';

@Component({
    selector: 'app-personal-records',
    standalone: true,
    imports: [],
    templateUrl: './personal-records.component.html',
    styleUrl: './personal-records.component.scss'
})
export class PersonalRecordsComponent implements OnInit {
    workouts!: Observable<Workout[]>;

    constructor(private workoutDataService: WorkoutDataService) {}

    ngOnInit() {
        this.workouts = this.workoutDataService.getAllWorkouts();
    }
}
