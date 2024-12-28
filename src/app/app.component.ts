import {Component, effect, inject, signal} from '@angular/core';
import {AuthService} from './services/auth/authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService)
  protected isSiteLoading = signal(false)
  protected isLoggedIn = signal(false)

  constructor() {
    effect(() => {
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        this.isLoggedIn.set(loggedIn)
      })
    });

    effect(() => {
      this.isSiteLoading.set(this.authService.isSiteLoading())
    });
  }

  title = 'FlareAlert';
}
