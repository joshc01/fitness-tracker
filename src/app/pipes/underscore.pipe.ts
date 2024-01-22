import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'underscore',
    standalone: true
})
export class UnderscorePipe implements PipeTransform {
    transform(value: string): string {
        return value.replace('_', ' ');
    }
}
