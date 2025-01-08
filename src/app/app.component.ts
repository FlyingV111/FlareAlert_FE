import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {AuthService} from './services/auth/authService/auth.service';
import {AlertService} from './services/alert-service/alert.service';
import {UserService} from './services/user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private alertService = inject(AlertService)
  private userService = inject(UserService)
  protected authService = inject(AuthService)
  protected title = 'FlareAlert';
  protected isSiteLoading = signal(false)

  constructor() {
    effect(() => {
      this.isSiteLoading.set(this.authService.isSiteLoading())
    });

    effect(() => {
      if (this.userService.user()) {
        this.alertService.connect()
      }
    });
  }

  testAlert() {
    this.alertService.startAlert()
  }
}
