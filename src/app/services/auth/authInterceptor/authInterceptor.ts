import {HttpInterceptorFn} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '../authService/auth.service';
import {Router} from '@angular/router';


export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const router = inject(Router);
  const authService = inject(AuthService);

  if (req.url.startsWith(environment.backendUrl) && token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 403) {
          authService.logout();
          router.navigate(['/login']).catch((err) => console.error('Navigation error:', err));
        }
        console.error('HTTP Error:', error);
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
