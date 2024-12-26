import { Component } from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  imports: [
    LucideAngularModule,
    RouterLinkActive,
    RouterLink
  ],
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

}
