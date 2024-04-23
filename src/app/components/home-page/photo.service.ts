import { Injectable } from '@angular/core';
import { Photo } from './models';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
    constructor() {}

    getImages(): Photo[] {
        return [
            {
                src: '/assets/images/man-lifting-weights.jpg',
                alt: 'Description for Image 1',
                title: 'Lifting Weights'
            },
            {
                src: '/assets/images/running-cloudy-day.jpg',
                alt: 'Description for Image 2',
                title: 'Running'
            },
            {
                src: '/assets/images/one-arm-pushup.jpg',
                alt: 'Description for Image 3',
                title: 'One-Arm Pushup'
            },
            {
                src: '/assets/images/arm-workout.jpg',
                alt: 'Description for Image 4',
                title: 'Arm Workout'
            }
        ];
    }
}
