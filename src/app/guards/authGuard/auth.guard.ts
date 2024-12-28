import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/authService/auth.service';
import {firstValueFrom} from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  return await firstValueFrom(authService.isLoggedIn$);
};
