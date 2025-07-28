import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../entities/user/store/user.store';
import { UserService } from '../../../entities/user/api/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private store = inject(UserStore);
  private userService = inject(UserService);

  isAuthenticated = this.store.isAuthenticated;
  username = this.store.username;
  currentUser = this.store.currentUser;

  signOut() {
    this.userService.logout();
  }
}
