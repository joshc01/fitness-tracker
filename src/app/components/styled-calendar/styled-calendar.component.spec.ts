import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyledCalendarComponent } from './styled-calendar.component';

describe('StyledCalendarComponent', () => {
    let component: StyledCalendarComponent;
    let fixture: ComponentFixture<StyledCalendarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StyledCalendarComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(StyledCalendarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
