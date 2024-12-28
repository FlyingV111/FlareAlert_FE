import {Injectable, inject, effect, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {User} from '../../../models/User';
import firebase from 'firebase/compat/app';
import * as auth from 'firebase/auth';
import {AuthProvider} from 'firebase/auth';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backendUrl + "/auth";
  private afAuth = inject(AngularFireAuth);
  private isLoggedInSubject = new Subject<boolean>();
  isSiteLoading = signal<boolean>(true);
  user = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    if (!this.user() || this.user() === null)
      this.checkUserOnAppStart();
    this.isSiteLoading.set(false);
  }

  login(email: string, password: string): void {
    this.isSiteLoading.set(true);
    this.afAuth.signInWithEmailAndPassword(email, password).then().then((userCredentials) => {
      this.checkUserCredentials(userCredentials).then(() => {});
    });
  }


  logout(): void {
    this.isSiteLoading.set(true);
    this.http.post(`${this.apiUrl}/logout`, {}, {withCredentials: true})
      .subscribe({
        next: () => {
          this.afAuth.signOut().then(() => {});
          this.isLoggedInSubject.next(false);
          this.user.set(null);
          this.router.navigate(['/login']).finally(() => {
            this.isSiteLoading.set(false);
          })
        },
        error: (err) => {
          console.error('Logout failed', err);
          this.isSiteLoading.set(false);
          this.router.navigate(['/login']).then();
        }
      });
  }


  async googleAuth() {
    await this.authLogin(new auth.GoogleAuthProvider());
  }

  async githubAuth() {
    await this.authLogin(new auth.GithubAuthProvider());
  }

  private async authLogin(provider: AuthProvider) {
    try {
      const userCredentials = await this.afAuth.signInWithPopup(provider);
      this.checkUserCredentials(userCredentials).then(() => {});
    } catch (err) {
      console.error('Auth login failed', err);
    }
  }

  private checkUserCredentials(userCredential: firebase.auth.UserCredential): Promise<void> {
    return new Promise((resolve, reject) => {
      userCredential.user?.getIdToken().then(token => {
        this.http.post<User>(`${this.apiUrl}/login`, {}, {
          withCredentials: true,
          headers: {Authorization: `Bearer ${token}`}
        }).subscribe({
          next: (user) => {
            this.isLoggedInSubject.next(true);
            this.user.set(user);
            this.isSiteLoading.set(false);
            this.router.navigate(['/dashboard']).then(() => {
              resolve();
            });
            this.checkUser();
          },
          error: (err) => {
            this.isLoggedInSubject.next(false);
            this.isSiteLoading.set(false);
            this.checkUser();
            reject(err);
          },
        });
      }).catch((err) => {
        console.error('Failed to get token', err);
        this.isLoggedInSubject.next(false);
        this.isSiteLoading.set(false);
        reject(err);
      });
    });
  }

  private checkUser() {
    this.http.get<User>(`${this.apiUrl}/me`, {withCredentials: true})
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.isLoggedInSubject.next(true);
        },
        error: () => {
          this.user.set(null);
          this.isLoggedInSubject.next(false);
        }
      });
  }

  private checkUserOnAppStart() {
    this.checkUser();
  }

  get isLoggedIn$() {
    return this.isLoggedInSubject.asObservable();
  }
}
