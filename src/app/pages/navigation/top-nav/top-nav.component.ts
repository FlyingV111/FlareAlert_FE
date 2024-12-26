import { Component } from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'top-nav',
  imports: [
    LucideAngularModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
  notificationsCount: number = 0;
}
