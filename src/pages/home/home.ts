import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../entities/user/store/user.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private store = inject(UserStore);
  currentUser = this.store.currentUser;
  isAuthenticated = this.store.isAuthenticated;
  username = this.store.username;
}
