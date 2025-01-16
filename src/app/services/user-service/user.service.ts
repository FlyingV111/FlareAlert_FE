import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UserSearchResult} from '../../models/User';
import {environment} from '../../../environments/environment';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient)
  private backendUrl = environment.backendUrl
  user = signal<User | null>(null)

  getCurrentUser() {
    this.http.get<User>(`${this.backendUrl}/user`).subscribe({
      next: (response) => {
        this.user.set(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
      }
    })
  }

  searchUsers(query: string): Observable<UserSearchResult[]> {
    return this.http.get<UserSearchResult[]>(`${this.backendUrl}/user/search?query=${encodeURIComponent(query)}`)
  }
}
