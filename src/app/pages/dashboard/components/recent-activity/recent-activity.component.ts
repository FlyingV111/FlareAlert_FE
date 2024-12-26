import { Component } from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {AlertCardComponent} from './components/alert-card/alert-card.component';

@Component({
  selector: 'recent-activity',
  imports: [
    LucideAngularModule,
    AlertCardComponent
  ],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.css'
})
export class RecentActivityComponent {

}
