import { Component, Input, inject, input } from '@angular/core';
import { User } from '../../../user/model/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'article-meta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-meta.html',
  styleUrl: './article-meta.css',
})
export class ArticleMeta {
  currentUser = input<User | null | undefined>(undefined);
  username = input<string | undefined>(undefined);
}
