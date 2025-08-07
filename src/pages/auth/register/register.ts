import { Component, inject, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../entities/user/api/user.service';
import { NewUser } from '../../../entities/user/model/new-user.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserStore } from '../../../entities/user/store/user.store';

interface RegisterError {
  error?: {
    errors?: Record<string, string[]>;
    message?: string;
  };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private store = inject(UserStore);

  registerForm = this.fb.group({
    username: [''],
    email: [''],
    password: [''],
  });

  private _errors = signal<string[]>([]);

  readonly errors = this._errors.asReadonly();
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
        const errorMessages = this.handleRegistrationError(
          error as unknown as RegisterError,
        );
        this._errors.set(errorMessages);
      }
    });
  }

  private handleRegistrationError(error: RegisterError): string[] {
    if (error?.error?.errors) {
      return Object.entries(error.error.errors).map(
        ([field, messages]) =>
          `${field} ${Array.isArray(messages) ? messages[0] : messages}`,
      );
    }
    return ['Registration failed. Please try again.'];
  }

  onSubmit(): void {
    if (this.isLoading()) return;

    this._errors.set([]);

    const formValue = this.registerForm.value;
    const userData: NewUser = {
      username: formValue.username || '',
      email: formValue.email || '',
      password: formValue.password || '',
    };

    this.userService.register(userData);
  }
}
