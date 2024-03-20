import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { WorkoutDO } from '../database/types/workout-DO';
import { Workout } from '../types/workout';
import { mapDOToWorkout, mapWorkoutToDO } from '../mappers/workout.mapper';

@Injectable({
    providedIn: 'root'
})
export class WorkoutDataService {
    private workoutsDOCollection: AngularFirestoreCollection<WorkoutDO>;
    private workoutsDO$: Observable<WorkoutDO[]>;

    workouts$: Observable<Workout[]>;

    constructor(private angularFirestore: AngularFirestore) {
        this.workoutsDOCollection = angularFirestore.collection<WorkoutDO>('workouts');
        this.workoutsDO$ = this.workoutsDOCollection.valueChanges();
        this.workouts$ = this.workoutsDO$.pipe(
            map((workoutsDO) => workoutsDO.map((workoutDO) => mapDOToWorkout(workoutDO)))
        );
    }

    //TODO: Add document id when added as value for 'id' field
    create(workout: Workout) {
        const workoutDO = mapWorkoutToDO(workout);

        return this.workoutsDOCollection.add({ ...workoutDO, id: this.workoutsDOCollection.ref.doc().id });
    }

    delete(id: string) {
        return this.workoutsDOCollection.doc(id).delete();
    }
}
