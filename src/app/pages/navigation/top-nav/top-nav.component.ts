import {Component, computed, effect, inject, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth/authService/auth.service';
import {User} from '../../../models/User';

@Component({
  selector: 'top-nav',
  imports: [
    LucideAngularModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
  private authService = inject(AuthService)
  protected user = signal<User | null>(null)
  notificationsCount: number = 0;

  constructor() {
    effect(() => {
      this.user.set(this.authService.user());
      console.log(this.user())
    });
  }


  logout(): void {
    this.authService.logout()
  }
}
