import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoService } from './photo.service';
import { NgOptimizedImage } from '@angular/common';
import { Photo } from './models';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [ToolbarModule, SharedModule, ButtonModule, RouterOutlet, TabMenuModule, GalleriaModule, NgOptimizedImage],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
    activeIndex = 0;

    images: Photo[] = [];

    constructor(private _photoService: PhotoService) {
        this.images = this._photoService.getImages();
    }
}
