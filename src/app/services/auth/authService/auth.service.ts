import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {TokenResponse} from '../../../models/auth/TokenResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendAuthUrl = environment.backendAuthUrl;
  private readonly TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  isSiteLoading = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, email: string, password: string): void {
    this.isSiteLoading.set(true);
    this.http.post<TokenResponse>(`${this.backendAuthUrl}/login`, {username, email, password}).subscribe({
      next: (response) => {
        if (response) {
          try {
            localStorage.setItem(this.TOKEN_KEY, response.accessToken);
            localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
          } catch (e) {
            console.error(e)
          }
        }
      },
      error: (error) => {
        this.isSiteLoading.set(false);
        console.error('Login failed:', error);
      },
      complete: () => {
        this.router.navigate(['/dashboard']).then();
        this.isSiteLoading.set(false);
      }
    })
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.router.navigate(['/login']).then();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
