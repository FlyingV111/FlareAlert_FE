import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {from, lastValueFrom} from 'rxjs';
import {environment} from '../../../../environments/environment';

const addBearerToken = async (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Promise<HttpEvent<any>> => {
  const angularFireAuth = inject(AngularFireAuth);
  const firebaseUser = await angularFireAuth.currentUser;
  const token = await firebaseUser?.getIdToken();
  if (token) {
    req = req.clone({
      setHeaders: {Authorization: `Bearer ${token}`},
    });
  }
  return lastValueFrom(next(req));
};

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.backendUrl)) {
    return from(addBearerToken(req, next));
  } else {
    return next(req);
  }
};