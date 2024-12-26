import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/authService/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService)
  const router = inject(Router)
  if (!authService.isLoggedIn()) {
    router.navigate(["/login"]).then()
    return false
  }
  return true
};
