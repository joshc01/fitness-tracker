import { Component, Input, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { SharedModule } from 'primeng/api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { Workout } from '../../types/workout';

type PrimeNGDate = {
    day: number;
    month: number;
    year: number;
    today?: boolean;
    selectable?: boolean;
};

@Component({
    selector: 'app-styled-calendar',
    standalone: true,
    imports: [CalendarModule, SharedModule, ReactiveFormsModule, NgStyle],
    templateUrl: './styled-calendar.component.html',
    styleUrl: './styled-calendar.component.scss'
})
export class StyledCalendarComponent implements OnInit {
    @Input()
    pastWorkouts: Workout[] = [];

    @Input()
    dateFormControl!: FormControl;

    @Input()
    idSuffix = '';

    allDateStrings: string[] = [];
    today = new Date();

    ngOnInit() {
        this.allDateStrings = this._getAllDates(this.pastWorkouts).map((date) => this._getPrimeNGDateFromDate(date));
    }

    getPrimeNGDateFromCalendar(primeNGDate: PrimeNGDate): string {
        return primeNGDate.month.toString() + primeNGDate.day.toString() + primeNGDate.year.toString();
    }

    private _getAllDates(workout: Workout[]): Date[] {
        return workout.map((workout) => workout.date);
    }

    private _getPrimeNGDateFromDate(date: Date): string {
        return date.getMonth().toString() + date.getDate().toString() + date.getFullYear().toString();
    }
}
