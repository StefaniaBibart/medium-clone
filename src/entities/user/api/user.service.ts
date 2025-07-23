import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserStore } from '../store/user.store';
import { NewUser } from '../model/new-user.model';
import { UserResponse } from '../model/user-response.model';
import { LoginUser } from '../model/login-user.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private store = inject(UserStore);
  private apiUrl = 'https://node-express-conduit.appspot.com/api';

  register(credentials: NewUser): void {
    this.store.setLoading(true);
    this.store.clearError();
    this.http
      .post<UserResponse>(`${this.apiUrl}/users`, { user: credentials })
      .pipe(map((response: UserResponse) => response.user))
      .subscribe({
        next: (user) => {
          this.store.setCurrentUser(user);
          this.store.setLoading(false);
        },
        error: (error) => {
          this.store.setLoading(false);
          this.store.setError(error);
        },
      });
  }

  login(credentials: LoginUser): void {
    this.store.setLoading(true);
    this.store.clearError();
    this.http
      .post<UserResponse>(`${this.apiUrl}/users/login`, { user: credentials })
      .pipe(map((response: UserResponse) => response.user))
      .subscribe({
        next: (user) => {
          this.store.setCurrentUser(user);
          this.store.setLoading(false);
        },
        error: (error) => {
          this.store.setLoading(false);
          this.store.setError(error);
        },
      });
  }

  setCurrentUser(user: User) {
    this.store.setCurrentUser(user);
  }

  clearCurrentUser() {
    this.store.logout();
  }
}
