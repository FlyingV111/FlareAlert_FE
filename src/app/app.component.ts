import {Component, effect, inject, signal} from '@angular/core';
import {AuthService} from './services/auth/authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected title = 'FlareAlert';
  protected authService = inject(AuthService)
  protected isSiteLoading = signal(false)

  constructor() {
    effect(() => {
      this.isSiteLoading.set(this.authService.isSiteLoading())
    });
  }
}
