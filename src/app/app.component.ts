import {Component, effect, inject, signal} from '@angular/core';
import {AuthService} from './services/auth/authService/auth.service';
import {AlertService} from './services/alert-service/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private alertService = inject(AlertService)
  protected title = 'FlareAlert';
  protected authService = inject(AuthService)
  protected isSiteLoading = signal(false)

  constructor() {
    effect(() => {
      this.isSiteLoading.set(this.authService.isSiteLoading())
    });
  }

  testAlert() {
    this.alertService.startAlert()
  }
}
