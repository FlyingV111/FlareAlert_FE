import {Component, Input} from '@angular/core';
import {LucideAngularModule} from "lucide-angular";

@Component({
  selector: 'alert-card',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './alert-card.component.html',
  styleUrl: './alert-card.component.css'
})
export class AlertCardComponent {
  @Input({required: true}) title!: string;
  @Input({required: true}) destination!: string;
  @Input({required: true}) time!: string;
  @Input({required: true}) numberOfNotified!: string;
}
