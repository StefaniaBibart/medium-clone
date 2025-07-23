import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../entities/user/store/user.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private store = inject(UserStore);

  isAuthenticated = this.store.isAuthenticated;
  username = this.store.username;
  currentUser = this.store.currentUser;

  signOut(event: Event) {
    event.preventDefault();
    this.store.logout();
  }
}
