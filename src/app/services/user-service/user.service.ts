import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/User';
import {environment} from '../../../environments/environment';

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
}
