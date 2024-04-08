import { ShortenedDate } from '../types/shortened-date';

export function mapDateToShortenedDate(date: Date): ShortenedDate {
    return {
        month: date.getMonth(),
        day: date.getDate(),
        year: date.getFullYear()
    };
}
