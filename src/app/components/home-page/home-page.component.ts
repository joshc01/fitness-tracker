import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [ToolbarModule, SharedModule, ButtonModule, RouterOutlet, TabMenuModule],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent {}
