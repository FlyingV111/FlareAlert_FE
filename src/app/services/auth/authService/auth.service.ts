import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backendUrl + "/auth";
  private afAuth = inject(AngularFireAuth);
  private isLoggedInSignal = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    effect(() => {
      this.isLoggedInSignal.set(this.afAuth.currentUser !== null);
    });
  }

  login(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password).then(userCredential => {
      userCredential.user?.getIdToken().then(token => {
        this.http.post(`${this.apiUrl}/login`, {}, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
          .subscribe({
            next: () => {
              this.isLoggedInSignal.set(true);
              this.router.navigate(['/dashboard']).then();
            },
            error: (err) => {
              this.isLoggedInSignal.set(false);
              console.error('Login failed', err);
            },
          });
      })
    }).catch(err => {
      console.error('Login failed -> Entered wrong Credentials', err)
    })
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, {withCredentials: true})
      .subscribe({
        next: () => {
          this.isLoggedInSignal.set(false);
          this.router.navigate(['/login']).then();
        },
        error: (err) => {
          console.error('Logout failed', err);
        },
      });
  }

  isLoggedIn() {
    return this.isLoggedInSignal();
  }
}
