import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth/authService/auth.service';
import {User} from '../../../models/User';
import {UserService} from '../../../services/user-service/user.service';

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
export class TopNavComponent implements OnInit {
  private userService = inject(UserService)
  private authService = inject(AuthService)
  protected user = signal<User | null>(null)
  notificationsCount: number = 0;

  constructor() {
    effect(() => {
      this.user.set(this.userService.user());
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser()
  }


  logout(): void {
    this.authService.logout()
  }
}
