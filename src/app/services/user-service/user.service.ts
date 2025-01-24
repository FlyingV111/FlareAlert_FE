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
  isLoadingUser = signal<boolean>(false)

  getCurrentUser() {
    this.isLoadingUser.set(true)
    this.http.get<User>(`${this.backendUrl}/user`).subscribe({
      next: (response) => {
        this.user.set(response);
      },
      error: (error) => {
        console.error(error);
        this.isLoadingUser.set(false)
      },
      complete: () => {
        this.isLoadingUser.set(false)
      }
    })
  }
}
