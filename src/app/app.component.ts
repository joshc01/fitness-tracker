import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ButtonModule, SharedModule, ToolbarModule, RouterLink, TooltipModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'fitness-tracker';
}
