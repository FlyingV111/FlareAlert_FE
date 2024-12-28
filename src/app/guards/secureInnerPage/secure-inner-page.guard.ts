import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/authService/auth.service';
import {firstValueFrom} from 'rxjs';

export const secureInnerPageGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const restrictedRoutes = ['/login'];

  let isLoggedIn = await firstValueFrom(authService.isLoggedIn$);

  authService.isLoggedIn$.subscribe((loggedIn) => {
    isLoggedIn = loggedIn;
    if (isLoggedIn) {
      return !restrictedRoutes.includes(state.url);
    } else {
      return true;
    }
  })


  if (isLoggedIn) {
    return !restrictedRoutes.includes(state.url);
  } else {
    return true;
  }
};
