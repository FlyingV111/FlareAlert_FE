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
  private authService = inject(AuthService)
  protected alertService = inject(AlertService);

  protected isLoggedIn = signal(false)

  constructor() {
    effect(() => {
      this.isLoggedIn.set(this.authService.isLoggedIn())
    });
  }
  title = 'FlareAlert';
}
