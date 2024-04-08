import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalRecordsComponent } from './personal-records.component';

describe('PersonalRecordsComponent', () => {
    let component: PersonalRecordsComponent;
    let fixture: ComponentFixture<PersonalRecordsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PersonalRecordsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PersonalRecordsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
