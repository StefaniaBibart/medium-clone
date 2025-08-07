import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../entities/user/api/user.service';
import { LoginUser } from '../../../entities/user/model/login-user.model';
import { UserStore } from '../../../entities/user/store/user.store';

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

  private _errorMessages = signal<string[]>([]);

  readonly errorMessages = this._errorMessages.asReadonly();
  readonly isLoading = this.store.isLoading;
  readonly authError = this.store.errors;

  constructor() {
    effect(() => {
      const user = this.store.currentUser();
      const errors = this.store.errors();

      if (user) {
        this.router.navigate(['/']);
      }

      if (errors) {
        this._errorMessages.set(errors);
      }
    });
  }

  onSubmit(): void {
    if (this.isLoading()) return;

    const formValue = this.loginForm.value;
    const userData: LoginUser = {
      email: formValue.email || '',
      password: formValue.password || '',
    };

    this.userService.login(userData);
  }
}
