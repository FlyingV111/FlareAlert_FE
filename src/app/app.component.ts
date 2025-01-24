import {Component, effect, inject, signal} from '@angular/core';
import {AuthService} from './services/auth/authService/auth.service';
import {UserService} from './services/user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected authService = inject(AuthService)
  protected userService = inject(UserService)
  protected title = 'FlareAlert';
  protected isSiteLoading = signal(false)

  constructor() {
    effect(() => {
      this.isSiteLoading.set(this.authService.isSiteLoading() || this.userService.isLoadingUser())
    });

    // effect(() => {
    //   if (this.userService.user()) {
    //     this.alertService.connect()
    //   }
    // });
  }

  //
  // testAlert() {
  //   this.alertService.startAlert()
  // }
}
