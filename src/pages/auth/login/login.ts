import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../entities/user/api/user.service';
import { LoginUser } from '../../../entities/user/model/login-user.model';
import { UserStore } from '../../../entities/user/store/user.store';

interface LoginError {
  error?: {
    errors?: Record<string, string[]>;
    message?: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private store = inject(UserStore);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });

  private _serverErrors = signal<string[]>([]);

  readonly serverErrors = this._serverErrors.asReadonly();
  readonly isLoading = this.store.isLoading;
  readonly authError = this.store.errors;

  constructor() {
    effect(() => {
      const user = this.store.currentUser();
      const error = this.store.errors();

      if (user) {
        this.router.navigate(['/']);
      }

      if (error) {
        const errorMessages = this.handleLoginError(
          error as unknown as LoginError,
        );
        this._serverErrors.set(errorMessages);
      }
    });
  }

  private handleLoginError(error: LoginError): string[] {
    const errorTypes = {
      hasFieldErrors: () => error.error?.errors !== undefined,
      hasMessageError: () => error.error?.message !== undefined,
    };

    const errorHandlers = {
      handleFieldErrors: () => {
        return Object.entries(error.error!.errors!).map(
          ([field, errors]) => `${field} ${errors}`,
        );
      },
      handleMessageError: () => {
        return [error.error!.message!];
      },
    };

    return errorTypes.hasFieldErrors()
      ? errorHandlers.handleFieldErrors()
      : errorTypes.hasMessageError()
        ? errorHandlers.handleMessageError()
        : [];
  }

  onSubmit(): void {
    if (this.isLoading()) return;

    this._serverErrors.set([]);

    const formValue = this.loginForm.value;
    const userData: LoginUser = {
      email: formValue.email || '',
      password: formValue.password || '',
    };

    this.userService.login(userData);
  }
}
