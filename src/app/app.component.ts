import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {AuthService} from './services/auth/authService/auth.service';
import {UserService} from './services/user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
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

  ngOnInit(): void {
    this.authService.silentRefresh()
  }

  //
  // testAlert() {
  //   this.alertService.startAlert()
  // }
}
