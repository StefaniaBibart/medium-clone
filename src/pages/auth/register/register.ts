import { Component, inject, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../entities/user/api/user.service';
import { NewUser } from '../../../entities/user/model/new-user.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserStore } from '../../../entities/user/store/user.store';

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

    const formValue = this.registerForm.value;
    const userData: NewUser = {
      username: formValue.username || '',
      email: formValue.email || '',
      password: formValue.password || '',
    };

    this.userService.register(userData);
  }
}
