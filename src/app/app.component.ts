import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons, SharedModule } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

type BreakpointInfo = {
    name: string;
    value: MediaQueryList;
};

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SharedModule, RouterOutlet, TabMenuModule, AsyncPipe, NgIf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    menuItems!: MenuItem[];
    activeItem!: MenuItem;

    breakpointsInfo: BreakpointInfo[] = [];
    breakpointState!: Observable<BreakpointState>;

    xSmall = Breakpoints.XSmall;
    small = Breakpoints.Small;
    medium = Breakpoints.Medium;
    large = Breakpoints.Large;
    xLarge = Breakpoints.XLarge;
    webLandscape = Breakpoints.WebLandscape;

    constructor(
        private _breakpointObserver: BreakpointObserver,
        private _mediaMatcher: MediaMatcher
    ) {}

    ngOnInit() {
        this.menuItems = [
            { label: 'Home', icon: PrimeIcons.HOME, routerLink: 'fitness-tracker/home' },
            { label: 'Add Workout', icon: PrimeIcons.PLUS, routerLink: 'fitness-tracker/workout' },
            { label: 'History', icon: PrimeIcons.BOOK, routerLink: 'fitness-tracker/workout-history' },
            {
                label: 'Personal Records',
                icon: PrimeIcons.SORT_NUMERIC_UP,
                routerLink: 'fitness-tracker/personal-records'
            },
            { label: 'Settings', icon: PrimeIcons.COG, routerLink: 'fitness-tracker/settings' }
        ];
        this.activeItem = this.menuItems[0];

        this.breakpointsInfo = this._getBreakpointsInfo();
        this.breakpointState = this._breakpointObserver.observe([
            this.xSmall,
            this.small,
            this.medium,
            this.large,
            this.xLarge,
            this.webLandscape
        ]);
    }

    private _getBreakpointsInfo(): BreakpointInfo[] {
        return [
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
            Breakpoints.Web,
            Breakpoints.WebLandscape,
            Breakpoints.WebPortrait,
            Breakpoints.Handset,
            Breakpoints.HandsetLandscape,
            Breakpoints.HandsetPortrait,
            Breakpoints.Tablet,
            Breakpoints.TabletLandscape,
            Breakpoints.TabletPortrait
        ].map((breakpoint, index) => ({
            name: Object.keys(Breakpoints)[index],
            value: this._mediaMatcher.matchMedia(breakpoint)
        }));
    }
}
