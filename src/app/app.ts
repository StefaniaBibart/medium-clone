import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../shared/layout/header/header';
import { Footer } from '../shared/layout/footer/footer';
import { UserStore } from '../entities/user/store/user.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly store = inject(UserStore);

  constructor() {
    this.store.loadUser();
  }
}
