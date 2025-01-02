import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/authService/auth.service';

export const secureInnerPageGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const restrictedRoutes = ['/login'];


  if (authService.isAuthenticated) {
    return !restrictedRoutes.includes(state.url);
  }
  return true
};
