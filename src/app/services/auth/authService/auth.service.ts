import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {TokenResponse} from '../../../models/auth/TokenResponse';
import {TokenRefreshRequest} from '../../../models/auth/TokenRefreshRequest';

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
            sessionStorage.setItem(this.TOKEN_KEY, response.accessToken);
            sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
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
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.router.navigate(['/login']).then();
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  silentRefresh() {
    const request: TokenRefreshRequest = {
      accessToken: this.getToken() || '',
      refreshToken: sessionStorage.getItem(this.REFRESH_TOKEN_KEY) || ''
    }
    if (!request.accessToken || !request.refreshToken) {
      return;
    }
    this.http.post<TokenResponse>(`${this.backendAuthUrl}/refresh-token`, request).subscribe({
      next: (response) => {
        if (response) {
          try {
            sessionStorage.setItem(this.TOKEN_KEY, response.accessToken);
            sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
          } catch (e) {
            console.error(e)
          }
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.router.navigate(['/login']).then();
      },
    })
  }
}
