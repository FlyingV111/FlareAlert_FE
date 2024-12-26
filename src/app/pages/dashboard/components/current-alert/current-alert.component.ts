import { Component } from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {NgIf} from '@angular/common';

@Component({
  selector: 'current-alert',
  imports: [
    LucideAngularModule,
    NgIf
  ],
  templateUrl: './current-alert.component.html',
  styleUrl: './current-alert.component.css'
})
export class CurrentAlertComponent {

}
