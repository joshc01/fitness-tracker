import { Component, OnInit } from '@angular/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SharedModule, RouterOutlet, TabMenuModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    menuItems!: MenuItem[];
    activeItem!: MenuItem;

    ngOnInit() {
        this.menuItems = [
            { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: 'fitness-tracker/home' },
            { label: 'Add Workout', icon: 'pi pi-fw pi-plus', routerLink: 'fitness-tracker/workout' },
            { label: 'History', icon: 'pi pi-fw pi-book', routerLink: 'fitness-tracker/workout-history' },
            {
                label: 'Personal Records',
                icon: 'pi pi-fw pi-sort-numeric-up-alt',
                routerLink: 'fitness-tracker/personal-records'
            },
            { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: 'fitness-tracker/settings' }
        ];

        this.activeItem = this.menuItems[0];
    }
}
