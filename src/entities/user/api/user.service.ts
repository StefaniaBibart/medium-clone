import { Injectable, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserStore } from '../store/user.store';
import { NewUser } from '../model/new-user.model';
import { UserResponse } from '../model/user-response.model';
import { LoginUser } from '../model/login-user.model';
import { User } from '../model/user.model';
import { environment } from '../../../environments/environment';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private store = inject(UserStore);
  private autoLogoutTimer: number | null = null;

  constructor() {
    effect(() => {
      this.store.loadUser(this.getCurrentUser.value()?.user);
    });

    effect(() => {
      const token = this.store.token();
      if (token) {
        this.startAutoLogoutTimer(token);
      } else {
        this.stopAutoLogoutTimer();
      }
    });
  }

  register(credentials: NewUser): void {
    this.store.setLoading(true);
    this.store.clearErrors();
    this.http
      .post<UserResponse>(`/users`, { user: credentials })
      .pipe(
        map((response: UserResponse) => response.user),
        catchError((httpErrorResponse) => {
          this.store.setLoading(false);
          this.store.setErrors(httpErrorResponse.error.errors.body);
          return of(null);
        }),
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.store.setCurrentUser(user);
          }
          this.store.setLoading(false);
        },
      });
  }

  login(credentials: LoginUser): void {
    this.store.setLoading(true);
    this.store.clearErrors();
    this.http
      .post<UserResponse>(`/users/login`, { user: credentials })
      .pipe(
        map((response: UserResponse) => response.user),
        catchError((httpErrorResponse) => {
          this.store.setLoading(false);
          this.store.setErrors(httpErrorResponse.error.errors.body);
          return of(null);
        }),
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.store.setCurrentUser(user);
          }
          this.store.setLoading(false);
        },
      });
  }

  getCurrentUser = httpResource<UserResponse>(() => {
    const token = this.store.token();
    if (!token) {
      return undefined;
    }
    return {
      url: `/user`,
    };
  });

  setCurrentUser(user: User) {
    this.store.setCurrentUser(user);
  }

  logout(): void {
    this.store.logout();
  }

  private startAutoLogoutTimer(token: string) {
    this.stopAutoLogoutTimer();

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      const now = new Date().getTime();
      const expiresIn = expiration - now;

      if (expiresIn > 0) {
        this.autoLogoutTimer = setTimeout(() => {
          this.logout();
          alert('Session expired. Please log in again.');
        }, expiresIn);
      } else {
        this.logout();
        alert('Session expired. Please log in again.');
      }
    } catch (e) {
      console.error('Invalid token, could not set up auto-logout.', e);
      this.logout();
      alert('You have been logged out due to an error. Please log in again.');
    }
  }

  private stopAutoLogoutTimer() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }
  }
}
