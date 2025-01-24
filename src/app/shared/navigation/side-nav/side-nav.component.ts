import { Component } from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterLinkActive,
    RouterLink
  ],
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

}
