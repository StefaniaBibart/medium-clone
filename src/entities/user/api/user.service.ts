import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserStore } from '../store/user.store';
import { NewUser } from '../model/new-user.model';
import { UserResponse } from '../model/user-response.model';
import { LoginUser } from '../model/login-user.model';
import { User } from '../model/user.model';
// import { httpResource } from '@angular/common/http';

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

  // endpoint is not working
  // getCurrentUser() {
  //   return httpResource<UserResponse>(() => {
  //     const token = this.store.token();
  //     if (!token) {
  //       return undefined;
  //     }
  //     return {
  //       url: `${this.apiUrl}/users`,
  //       headers: {
  //         Authorization: `Token ${token}`,
  //       },
  //     };
  //   });
  // }

  setCurrentUser(user: User) {
    this.store.setCurrentUser(user);
  }

  logout(): void {
    this.store.logout();
  }
}
